<template>
    <div class="content">
        <div class="amount-box">
            <div class="amount-select">
                <input type="number" v-model="inputValue" @keypress="onlyNumbers" @input="resizeInput" min="1"
                    max="1000" class="amount-input green">
                <span class="message-amount-sats">
                    SATS
                </span>
            </div>
            <span class="message-label">
                for each message
            </span>
            <span class="cost-label">
                Cost <strong>{{store.lnAddresses.filter(item => item.active && item.preset === store.getActivePreset).length * store.getAmount  }} sats</strong>
            </span>
        </div>
        <textarea name="message" id="message" cols="30" rows="10" placeholder="Type your message..."
            v-model="messageValue"></textarea>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLnAddressesStore } from '@/stores/lnaddresses';

const store = useLnAddressesStore();
const inputValue = ref(1);
const messageValue = ref(null);

const resizeInput = (event) => {
    const input = event.target;
    input.style.width = (input.value.length + 1) * 70 + 'px';
}


watch(() => messageValue.value, (newValue) => {
    store.changeMessage(newValue);
});

watch(() => inputValue.value, (newValue) => {
    store.changeAmount(newValue);
});

const onlyNumbers = (event) => {
    const keyCode = event.keyCode;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 37 && keyCode !== 39) {
        event.preventDefault();
    }
};
</script>

<style lang="scss" scoped>
.content {
    flex: 1;
    margin: 4rem 0;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4rem;

    .amount-box {
        align-items: center;
        display: flex;
        flex-direction: column;

        .amount-input {
            font-size: 9rem;
            font-weight: 600;
            background-color: transparent;
            border: none;
            color: white;
            outline: none;
            width: 90px;
            color: var(--green);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            & {
                -moz-appearance: textfield;
            }
        }

        .amount-select {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;

            .message-amount-sats {
                font-weight: 600;
            }
        }

        .cost-label {
            margin: 1rem 0;
            align-items: center;
            display: flex;
            gap: 1rem;

            strong {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--green);
                margin-top: -3px;
            }
        }
    }

    #message {
        width: 100%;
        background-color: var(--textarea-color);
        border: 1px solid var(--border-color);
        border-radius: 1rem;
        color: var(--green);
        padding: 1rem;
        font-size: 1.2rem;
        font-family: inherit;
        resize: none;

        &:focus {
            outline: 1px solid var(--green);
        }

        &::placeholder {
            font-size: 1rem;
        }
    }
}
</style>