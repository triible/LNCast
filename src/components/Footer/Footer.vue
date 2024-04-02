<template>
    <footer>
        <button class="send" id="send-button" @click="toggleStatusModal">{{ error ?? "SEND NOW" }}</button>
        <StatusModal v-if="statusModalShow" @toggle="toggleStatusModal" />
    </footer>
</template>

<script setup>
import { ref } from 'vue';
import StatusModal from '../Modal/StatusModal.vue';
import { useLnAddressesStore } from '@/stores/lnaddresses';

const store = useLnAddressesStore();
const statusModalShow = ref(false);
const error = ref(null)

function toggleStatusModal() {
    if(store.getLnAddresses.filter(item => item?.active)?.length > 0 && store.getMessage && store.getAmount > 0) {
        statusModalShow.value = !statusModalShow.value;
    } else {
        error.value = "Please write a message, select at least 1 address and enter amount greater than 0..."
    }
}
</script>

<style lang="scss" scoped>
#send-button {
    width: 100%;
    height: 80px;
    background-color: var(--green);
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.8rem;

    &:hover {
        filter: contrast(1.2)
    }
}
</style>