import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLnAddressesStore = defineStore('lnAddresses', () => {
  const lnAddresses = ref([])
  const activePreset = ref('Default');
  const amount = ref(1);
  const message = ref(null);

  function setLnAddresses(newValue) {
    lnAddresses.value = newValue;
  }

  function pushAddresses(addresses) {
    const addressUnique = lnAddresses.value.filter(item => item.lnAddress !== addresses[0].lnAddress);
    lnAddresses.value = addressUnique;
    lnAddresses.value.push(...addresses)
  }

  function toggleActiveLnAddress(lnAddress) {
    lnAddresses.value.map((item) => {
      if (item.lnAddress === lnAddress) {
        item.active = !item.active;
      }
    })
  }

  function toggleAllLnAddressActive() {
    if (lnAddresses.value.find(item => !item.active && item.preset === activePreset.value)) {
      lnAddresses.value.map((item) => item.active = true && item.preset === activePreset.value)
    } else {
      lnAddresses.value.map((item) => item.active = false && item.preset === activePreset.value)
    }
  }

  function changePreset(preset) {
    activePreset.value = preset;
  }

  function changeAmount(newAmount) {
    amount.value = newAmount;
  }

  function changeMessage(newMessage) {
    message.value = newMessage;
  }

  const getActivePreset = computed(() => activePreset.value)
  const getLnAddresses = computed(() => lnAddresses.value)
  const getAmount = computed(() => amount.value)
  const getMessage = computed(() => message.value)


  return { lnAddresses, setLnAddresses, pushAddresses, toggleActiveLnAddress, toggleAllLnAddressActive, getActivePreset, getLnAddresses, getAmount, getMessage, changePreset, changeAmount, changeMessage }
})
