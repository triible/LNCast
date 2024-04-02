<template>
    <div class="modal">
        <div class="adress-modal">
            <div class="title">
                <h3>{{ chatInfo?.message }}</h3>
                <strong>Done: {{ chat?.lnAddresses?.filter(item => item.sent === true)?.length ?? 0 }} / {{
                    chat?.lnAddresses?.length ?? 0 }}</strong>
            </div>
            <ul id="list">
                <li v-for="item in chat?.lnAddresses">
                    {{ item?.address ?? item?._id }}
                    <button class="sent-span">
                        <svg v-if="item?.sent === 'null'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                            <circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="40" cy="100">
                                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                                    keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                            </circle>
                            <circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="100" cy="100">
                                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                                    keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                            </circle>
                            <circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="160" cy="100">
                                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                                    keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                            </circle>
                        </svg>
                        <span v-else-if="item?.sent === false">❌</span>
                        <span v-else>☑️</span>
                    </button>
                </li>
            </ul>
            <button type="button" class="close-button" :disabled="chatInfo?.message !== 'Finished'" @click="reset(), $emit('toggle')">{{ chatInfo?.message
                    === 'Finished' ? 'Exit' : 'Please Wait...' }}</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import io from 'socket.io-client';
import Axios from 'axios';
import { useLnAddressesStore } from '@/stores/lnaddresses';
const socket = io("http://localhost:9010");


const chat = ref([]);

const chatInfo = ref(null);

const store = useLnAddressesStore();

socket.on("messageProcess", async (message) => {

    chat.value = chat.value?.lnAddresses.filter(item => item.address !== message?.address)

    chat.value.lnAddresses = [...chat.value, message]

});



socket.on("chatStatus", async (message) => {
    chatInfo.value = message;
});

socket.on("chat", async (message) => {
    chat.value = message;
});

onMounted(async () => {
    const lnAddresses = [];
    store.getLnAddresses.forEach((item => {
        if(item?.active) {
            lnAddresses.push({ address: item?.lnAddress, sent: false })
        }
    }))


    await Axios.post(import.meta.env.VITE_APP_API + '/send-message', {
        lnAddresses,
        amount: store.getAmount,
        message: store.getMessage
    });

})

const newAdressBox = ref(false);
const adressText = ref(null);
const searchText = ref(null);

function reset() {
    newAdressBox.value = false;
    searchText.value = null;
    adressText.value = null;
}
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #000000b4;

    .adress-modal {
        display: flex;
        flex-direction: column;
        background: var(--textarea-color);
        width: 600px;
        height: 100%;
        max-height: 500px;
        padding: 1.5rem;
        border-radius: 1rem;
        margin: auto;
        color: white;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--textarea-color);
            padding-bottom: 0.5rem;
            display: flex;
            gap: 10px;

            .flex {
                display: flex;
                gap: 10px;
            }

            h3 {
                font-weight: 500;
                margin: 0;
                font-size: 1rem;
            }

            display: flex;
            gap: 10px;

            button {
                background-color: var(--border-color);
                color: var(--green);
                border: none;
                font-weight: 600;
                padding: 10px 1rem;
                border-radius: 3px;

                &:hover {
                    filter: contrast(0.9);
                }
            }

            .sent-span {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

        }

        .new-adress {
            display: flex;
            width: 100%;
            gap: 2rem;
            font-size: 0.9rem;
            padding: 1rem 1rem !important;
            margin: 10px 0;
            border: 1px solid var(--border-color);
            align-items: center;
            background-color: #0d0d0d;

            label {
                font-weight: 500;
            }

            input {
                flex: 1;
                height: 40px;
                background: transparent;
                border: none;
                outline: none;
                color: var(--green);
            }
        }

        .search-input {
            width: 100%;
            border: none;
            background-color: transparent;
            height: 50px;
            outline: none;
            color: white;
        }

        #list {
            flex: 1;
            width: 100%;
            border: 1px solid #222;
            background-color: #0d0d0d;
            padding: 0;
            overflow-y: auto;

            li {
                display: flex;
                justify-content: space-between;
                width: 100%;
                border-bottom: 1px solid #161616;
                padding: 10px 1rem;
                list-style: none;
                font-size: 0.9rem;
                cursor: pointer;

                &:hover {
                    background-color: #161616;
                }

                button {
                    background-color: transparent;
                    border: none;
                    font-size: 0.8rem;
                }
            }
        }

        .close-button {
            height: 60px;
            margin-top: 1.5rem;
            background-color: var(--green);
            color: var(--white);
            font-weight: 600;
            border-radius: 10px;
            border: none;

            &:disabled {
                background-color: transparent;
            }

            &:hover {
                filter: contrast(1.2)
            }
        }
    }
}
</style>