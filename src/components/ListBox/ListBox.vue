<template>
    <div class="list-box">
        <div class="left">
            <button class="add-list" @click="toggleAdressModal">Edit</button>
            <span><strong class="green">
                {{lnAddressStore.lnAddresses.filter(item => item.active && item.preset === lnAddressStore.getActivePreset).length }} / {{ lnAddressStore.lnAddresses.filter(item => item.preset === lnAddressStore.getActivePreset).length }}
            </strong> adresses selected</span>
        </div>
        <button class="add-list" @click="lnAddressStore.toggleAllLnAddressActive()">{{ lnAddressStore.lnAddresses.find(item => !item.active && item.preset === lnAddressStore.getActivePreset) ? 'Select All' : 'Select None' }}</button>
        
        <AdressModal v-show="adressModalShow" @toggle="toggleAdressModal" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AdressModal from '../Modal/AdressModal.vue';
import { useLnAddressesStore } from '@/stores/lnaddresses';

const lnAddressStore = useLnAddressesStore();
const adressModalShow = ref(false);

function toggleAdressModal() {
    adressModalShow.value = !adressModalShow.value;
}
</script>

<style lang="scss" scoped>
.list-box {
    display: flex;
    justify-content: space-between;

    .left {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    button {
        background-color: var(--border-color);
        color: var(--green);
        border: none;
        font-weight: 600;
        padding: 10px 1rem;
        border-radius: 3px;

        &:hover {
            filter: contrast(0.9)
        }
    }
}
</style>