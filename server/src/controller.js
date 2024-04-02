import Axios from "axios";
import lnService from 'ln-service'
import HTTP_STATUS from "./types/httpStatusCodes.js";
import LnAddress from "./models/lnAddress.model.js";
import Chat from "./models/chat.model.js";
import Presets from "./models/presets.model.js";
import { serverIO } from "../index.js";


const addLnAddress = async (req, res) => {
  const { lnAddresses } = req.body;
  try {
    if (!lnAddresses || lnAddresses.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ info: "You should provide a lnaddress..." });
    }

    const set = new Set();

    lnAddresses.forEach(element => {
      set.add(element);
    });

    await Promise.all(
      lnAddresses.map(async lnAddress => {
        const isExist = await LnAddress.findOne({
          lnAddress: lnAddress?.lnAddress,
          preset: lnAddress?.preset ?? 'Default'
        });
        if (isExist) {
          set.delete(lnAddress);
          await LnAddress.deleteMany({ lnAddress: lnAddress?.lnAddress, preset: lnAddress.preset ?? 'Default' })
        }
      })
    );

    const newLnAddresses = await Promise.all(
      Array.from(set.values()).map(async value => {
        const newLnAddress = new LnAddress({ lnAddress: value.lnAddress, preset: value.preset ?? 'Default' });
        return await newLnAddress.save();
      })
    );

    return res.status(HTTP_STATUS.OK).json({ newLnAddresses });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const addPreset = async (req, res) => {

  try {
    const { presets } = req.body;

    if (presets.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'You should proive a presets list...' });
    }

    const savedPresets = await Promise.all(presets.map(async (item) => {
      const latestPreset = await Presets.find({}).sort({ order: 1 })
      return await Presets.create({ title: item.title, order: item.order ?? latestPreset.order ?? 0 })
    }))

    return res.status(HTTP_STATUS.OK).json({ presets: savedPresets });

  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
  }
}

const getPresets = async (req, res) => {

  try {
    const presets = await Presets.find({}).sort({ order: -1 })

    return res.status(HTTP_STATUS.OK).json({ presets });

  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
  }
}

const deleteLnAddress = async (req, res) => {
  try {
    const lnAddress = req.query?.lnAddress;
    const preset = req.query?.preset;

    if (!lnAddress) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'You should provide a lnAddress' });
    }

    return res.status(HTTP_STATUS.OK).json({ response: await LnAddress.deleteOne({ lnAddress, preset: preset ?? 'Default' }) });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
  }
}

const getAllLnAddresses = async (req, res) => {
  try {
    const lnAddresses = await LnAddress.find({});
    return res.status(HTTP_STATUS.OK).json({ lnAddresses: lnAddresses ?? [] })
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
  }
}

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ updatedAt: -1 });
    return res.status(HTTP_STATUS.OK).json({ chats: chats ?? [] })
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
  }
}

const sendMessage = async (req, res) => {
  const { lnAddresses, amount, message } = req.body;

  if (lnAddresses?.length === 0 || !amount) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Bad request...' });
  }
  const chat = await Chat.create({ lnAddresses, sent: false, amount, message });

  try {

    serverIO.emit("chat", {
      ...chat,
      lnAddresses: chat?.lnAddresses.map(item => {
        return {
          ...item.toObject(),
          sent: 'null'
        }
      })
    })

    serverIO.emit('chatStatus', { chatId: chat?._id, message: 'Started' });

    await Promise.all(lnAddresses.map(async (lnAddress) => {
      await processLnAddress(chat?._id, lnAddress, amount, req);
    }))

    chat.sent = true;
    await chat.save()
    serverIO.emit('chatStatus', { chatId: chat?._id, message: 'Finished' });

    res.status(HTTP_STATUS.OK).json({ message: "OK" })

  } catch (error) {
    chat.error = error;
    await chat.save();
    console.error(error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
  }

}

const processLnAddress = async (chatId, lnAddress, amount, req) => {
  try {
    const infoResponse = await getUserLnAddressInfo(lnAddress?.address);

    if (infoResponse?.minSendable <= amount * 1000 && infoResponse?.maxSendable >= amount * 1000) {
      const pr = await getLnPay(infoResponse.callback, amount, req?.body?.message?.toString());
      if (pr) {
        await sendMessageToLnAddress(chatId, lnAddress, pr, amount, req);
      } else {
        handleInvalidLnAddress(chatId, lnAddress, amount);
      }
    } else {
      handleInvalidLnAddress(chatId, lnAddress, amount);
    }
  } catch (error) {
    handleInvalidLnAddress(chatId, lnAddress, amount);
  }
}

const getUserLnAddressInfo = async (lnAddress) => {
  try {
    const [username, domain] = lnAddress.split('@');
    const response = await Axios.get(`https://${domain}/.well-known/lnurlp/${username}`);
    return response?.data?.minSendable ? { minSendable: response.data.minSendable, maxSendable: response.data.maxSendable, callback: response.data.callback } : null;
  } catch (error) {
    return null;
  }
}

const getLnPay = async (callback, amount, message) => {
  try {
    const messageParams = new URLSearchParams();
    messageParams.set("comment", message)
    const response = await Axios.get(`${callback}/?amount=${amount * 1000}&${messageParams.toString()}`);
    return response?.data?.pr ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const handleInvalidLnAddress = async (chatId, lnAddress) => {
  serverIO.emit('messageProcess', { chatId, sent: lnAddress?.sent, address: lnAddress?.address });
}

const sendMessageToLnAddress = async (chatId, lnAddress, invoice, amount, req) => {
  try {
    const decodedInvoice = await decodeInvoice(req.decodeLnd, invoice, amount);
    const status = await doChecksOnInvoice(decodedInvoice, amount, req);

    switch (status) {
      case 'OK':
        const maxAttemptCount = 3;
        let retryCount = 0;

        while (retryCount < maxAttemptCount) {
          const payment = await lnService.pay({ lnd: req.refundLnd, request: invoice });
          if (payment?.is_confirmed) {
            lnAddress.sent = true;
            break;
          } else {
            lnAddress.sent = false;
            retryCount++;
            if (retryCount < maxAttemptCount) {
              const waitFor5seconds = 5000;
              await new Promise(resolve => setTimeout(resolve, waitFor5seconds));
            }
          }
        }
        serverIO.emit('messageProcess', { chatId, sent: lnAddress?.sent, address: lnAddress?.address });
        await Chat.findOneAndUpdate({ _id: chatId, "lnAddresses": { $elemMatch: { address: lnAddress.address } } }, { $set: { "lnAddresses.$.sent": lnAddress.sent } })
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }

}

const decodeInvoice = async (lnd, request, amount) => {
  return await lnService.decodePaymentRequest({ lnd, request });
}

const doChecksOnInvoice = async (invoice, amount, req) => {

  let status = 'OK';

  const requestedAmount = Number(invoice.tokens);

  const isExpired = checkInvoicesExpires(invoice.expires_at);

  if (!isNaN(requestedAmount) && requestedAmount > 0) {
    if (isExpired) {
      status = 'EXPIRED';
    } else if (requestedAmount === amount) {
      status = 'OK';
    } else {
      status = 'ERROR'
    }
  }
  return status
}

const checkInvoicesExpires = (expiresDate) => {
  const invoiceExpiresTime = new Date(expiresDate);
  const now = new Date();

  if (invoiceExpiresTime <= now) {
    return true;
  }

  const fiveMin = new Date(now.getTime() - 5 * 60 * 1000);

  if (invoiceExpiresTime < fiveMin) {
    return true;
  }

  return false;
}

export {
  addLnAddress,
  sendMessage,
  getAllLnAddresses,
  deleteLnAddress,
  addPreset,
  getAllChats,
  getPresets
}