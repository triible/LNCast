<template>
    <div class="modal" @click="reset(), $emit('toggle')">
        <div class="address-modal" @click.stop>
            <div class="title">
                <div class="flex">
                    <input type="file" @change="handleFileUpload" accept=".txt, .csv" ref="fileInput" hidden />
                    <button @click="openFileInput" v-if="!importScreen">Import</button>
                    <button @click="newAddressBox = !newAddressBox">{{ newAddressBox ? 'X' : 'Add' }}</button>
                </div>
                <h3>{{ importScreen ? 'Preview' : 'Lightning Address List' }}</h3>
                <button class="add-list"
                    @click="importScreen ? importScreen = !importScreen : lnAdressStore.toggleAllLnAddressActive()">{{
        importScreen ? 'X' : lnAdressStore.lnAddresses.find(item => !item.active && item.preset ===
            lnAdressStore.getActivePreset) ? 'Select All' : 'Select None' }}</button>

            </div>
            <div class="new-address" v-if="newAddressBox">
                <label for="add-address">New Address</label>
                <input type="text" name="add-address" id="add-address"
                    :placeholder="newAddressMessage ?? 'address@lnaddress.com'" v-model="addressText"
                    ref="newAddressInput"
                    @keyup.enter="importScreen ? addLnAddressToArray(addressText) : addLnAddressToDB(addressText)">
            </div>
            <input type="text" class="search-input" v-model="searchText"
                :placeholder="`Search in ${lnAdressStore.getLnAddresses.length} addresses...`" @input="search"  spellcheck="false"
                autocomplete="off">

            <div class="presets">
                <label>Presets</label>
                <button :class="{ active: 'Default' === lnAdressStore.getActivePreset }" v-if="!presets.find(item => item.title === 'Default')"
                 @click="switchPreset('Default')">Default</button>
                <button :class="{ active: preset.title === lnAdressStore.getActivePreset }" v-for="preset in presets"
                    v-bind:key="preset.title" @click="switchPreset(preset.title)">{{ preset.title }}</button>
                <button @click="newPresetInput = !newPresetInput">+</button>
                <input type="text" class="new-preset-input" v-if="newPresetInput" placeholder="Press enter..." v-model="newPresetTitle" @keyup.enter="addPreset" />
            </div>
            <ul id="list">
                <li v-for="(address, index) in searchResult ?? lnAdressStore.lnAddresses.filter(item => item.preset === lnAdressStore.getActivePreset)"
                    :key="index">
                    {{ address.lnAddress }}
                    <div class="controls">
                        <button v-if="!importScreen" @click="lnAdressStore.toggleActiveLnAddress(address.lnAddress)"
                            class="deleteAddress">

                            <span v-if="!address?.active">Select</span>
                            <span v-else>☑️</span>
                        </button>
                        <button class="deleteAddress" @click="deleteAddress(address)">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                viewBox="0 0 48 48">
                                <path fill="#b39ddb"
                                    d="M30.6,44H17.4c-2,0-3.7-1.4-4-3.4L9,11h30l-4.5,29.6C34.2,42.6,32.5,44,30.6,44z">
                                </path>
                                <path fill="#9575cd" d="M28 6L20 6 14 12 34 12z"></path>
                                <path fill="#7e57c2" d="M10,8h28c1.1,0,2,0.9,2,2v2H8v-2C8,8.9,8.9,8,10,8z"></path>
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <button type="button" class="save-button" :disabled="lnAdressStore.getLnAddresses.length === 0"
                v-if="importScreen" @click="saveCSV">SAVE TO
                DATABASE</button>
        </div>
    </div>
</template>

<script setup>
import { useLnAddressesStore } from '@/stores/lnaddresses';
import Axios from 'axios';
import { ref, onMounted } from 'vue';

const newAddressBox = ref(false);
const searchResult = ref(null);
const addressText = ref(null);
const searchText = ref(null);
const newAddressMessage = ref(null);

const newPresetInput = ref(false);
const newPresetTitle = ref(null);



const importScreen = ref(false);
const fileInput = ref(null);

const lnAdressStore = useLnAddressesStore();

const presets = ref([])


function reset() {
    newAddressBox.value = false;
    searchText.value = null;
    addressText.value = null;
    importScreen.value = false;
}

function search() {
    searchResult.value = lnAdressStore.getLnAddresses.filter(item => item.lnAddress.toLowerCase().includes(searchText.value.toLowerCase()))
}

function handleFileUpload(event) {

    const file = event.target.files[0];

    if (!file) {
        console.error('Please select a CSV or TXT file...');
        return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'txt' && extension !== 'csv') {
        console.error('Please select a CSV or TXT file...');
        return;
    }


    const reader = new FileReader();

    reader.onload = (event) => {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const parsedAddresses = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const columns = line.split(',');
                if (!columns[0].includes('@')) continue
                parsedAddresses.push({ lnAddress: columns[0], preset: lnAdressStore.getActivePreset });
            }
        }
        lnAdressStore.setLnAddresses(parsedAddresses, lnAdressStore.getActivePreset);
    };
    reader.readAsText(file);
}

function openFileInput() {
    importScreen.value = true;
    if (fileInput?.value) fileInput.value.click();
}

async function deleteAddress(address) {
    try {
        if (!importScreen) {
            await addLnAddressToDB(address)
        }
        await Axios.delete(import.meta.env.VITE_APP_API + '?lnAddress=' + address.lnAddress + '&preset=' + lnAdressStore.getActivePreset);
        lnAdressStore.setLnAddresses(lnAdressStore.lnAddresses.filter(item => item.lnAddress !== address.lnAddress));
    } catch (error) {
        console.error(error)
    }
}

function addLnAddressToArray(address) {
    if (!address.includes('@')) {
        newAddressMessage.value = 'Please provide valid LNAddress...'
        addressText.value = null;
        return
    }
    lnAdressStore.pushAddresses({ lnAddress: address, preset: lnAdressStore.getActivePreset });
    addressText.value = null;
    newAddressBox.value = false;
}

async function saveCSV() {
    lnAdressStore.lnAddresses.map(async (item) => {
        await addLnAddressToDB(item.lnAddress)
    })
    reset();
}

async function addLnAddressToDB(address) {
    try {
        const response = await Axios.post(import.meta.env.VITE_APP_API + '/add-lnaddress',
            {
                lnAddresses: [
                    {
                        lnAddress: address,
                        preset: lnAdressStore.getActivePreset
                    }
                ]
            }
        );
        lnAdressStore.pushAddresses(response?.data?.newLnAddresses);
        addressText.value = null;
        newAddressBox.value = false;

    } catch (error) {
        console.log('There arent any address on database...')
    }
}

async function switchPreset(preset) {
    lnAdressStore.changePreset(preset);
    await loadLnAddresses();
}

async function loadLnAddresses() {
    try {
        const response = await Axios.get(import.meta.env.VITE_APP_API + '?preset=' + lnAdressStore.getActivePreset);
        lnAdressStore.setLnAddresses(response?.data?.lnAddresses);
    } catch (error) {
        console.log('There arent any address on database...')
    }
}

async function loadPresets() {
    try {
        const response = await Axios.get(import.meta.env.VITE_APP_API + '/presets');
        let presetsData = response?.data?.presets;

        presetsData = presetsData.sort((a, b) => a.order - b.order);

        presetsData.map(element => {
            presets.value.push({ title: element.title, order: element.order })
        });

    } catch (error) {
        console.log('There arent any address on database...')
    }
}

async function addPreset() {
    try {
        const response = await Axios.post(import.meta.env.VITE_APP_API + '/add-preset', {
            presets: [{
                title: newPresetTitle.value
            }]
        });

        let presetsData = response.data.presets;

        presetsData = presetsData.sort((a, b) => a.order - b.order);

        presetsData.map(element => {
            presets.value.push({ title: element.title, order: element.order })
        });

        newPresetInput.value = false

    } catch (error) {
        console.log('There arent any address on database...')
    }
}

onMounted(async () => {
    await loadLnAddresses()
    await loadPresets()
})

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

    .address-modal {
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
                @media screen and (max-width: 768px) {
                    display: none;
                }
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

        }

        .new-address {
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

        .presets {
            margin-bottom: 10px;
            label {
                margin-right: 10px;
                font-size: 0.8rem;
            }
            button {
                margin-right: 5px;
                margin-bottom: 5px;
                border: none;
                background-color: var(--border-color);
                padding: 6px 10px;
                border-radius: 3px;
                color: #bdbdbd;
                font-weight: 600;
                font-size: 0.8rem;

                &.active {
                    background-color: var(--green);
                    color: white;
                }

                &:hover {
                    filter: contrast(0.8);
                }
            }
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

                .controls {
                    display: flex;
                }

                &:hover {
                    background-color: #161616;
                }

                button {
                    background-color: transparent;
                    border: none;
                    font-size: 0.8rem;

                    &.deleteAddress {
                        color: red;
                    }
                }
            }
        }

        .save-button {
            height: 60px;
            margin-top: 1.5rem;
            background-color: var(--green);
            color: var(--white);
            font-weight: 600;
            border-radius: 10px;
            border: none;

            &:disabled {
                opacity: 0.5;
            }

            &:hover {
                filter: contrast(1.2)
            }
        }
    }
}

.new-preset-input {
    margin-right: 5px;
    margin-bottom: 5px;
    border: none;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 3px;
    color: #000000;
    font-size: 0.8rem;
}
</style>