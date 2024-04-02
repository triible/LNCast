<template>

  <div class="item">

    <header>
      <div class="date-info">
        <label>Time</label>
        <span>{{ new Date(item.updatedAt).toDateString() }}</span>
        <span class="time">{{ new Date(item.updatedAt).toLocaleTimeString() }}</span>
      </div>

      <div class="sats-info">
        <label>Cost</label>
        <span><strong>{{ item?.lnAddresses.filter(item => item.sent === true).length * item?.amount }}</strong>
          sats</span>
      </div>

      <div class="message-count-info">
        <label>Message Count</label>
        <span><strong class="green">{{ item?.lnAddresses.filter(item => item.sent === true).length }}
            successful</strong>/<strong class="red">{{ item?.lnAddresses.filter(item => item.sent === false).length }}
            fails</strong></span>
      </div>
    </header>


    <p class="message"><strong>Message</strong>{{ `"${item?.message ?? 'No message'}"` }}</p>
    <button class="show-addresses-btn" :class="{ 'gray-bg': showAddresses }" @click="showAddresses = !showAddresses">{{
          !showAddresses ? 'Show' : 'Hide' }} Addresses</button>

    <div class="addresses" v-if="showAddresses">
      <li v-for="address in item?.lnAddresses" class="green">
        <span>{{ address?.address }}</span>
        <button class="sent-span" :class="{ 'red': !address?.sent }">
          <span>{{ address?.sent ? 'Sent' : 'Failed' }}</span>
        </button>
      </li>
    </div>

  </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';
const showAddresses = ref(false)


defineProps({
  item: Object
})
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 0;
  border-bottom: 1px solid #222;

  header {
    display: flex;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
}

.date-info,
.sats-info {
  flex: 1;
  display: flex;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .time {
    font-size: 0.8rem;
  }
}

.date-info span,
.sats-info span {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--green);
}

.message-count-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.message-count-info span {
  font-weight: 700;
  color: hsl(0deg 0% 33.33%);

  strong {
    margin: 0 5px;

    &.red {
      color: hsl(0deg 100% 37%);
    }
  }
}

.addresses {
  display: flex;
  flex-direction: column;
  width: 100%;

  h3 {
    margin: 10px 1rem;
    text-align: center;
  }
}

.addresses li {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 14px 0 14px 1rem;
  border-bottom: 1px solid #222;
  font-size: 0.9rem;
  border-radius: 5px;
  color: white;

  .red {
    span {
      color: hsl(0deg 100% 37%) !important;
    }
  }

  &.green {
    .sent-span {
      span {
        color: var(--green)
      }
    }
  }
}

.addresses li span {
  font-weight: 500;

}

.sent-span {
  margin-right: 14px;

  span {
    font-weight: 900 !important;
  }
}

.addresses li button {
  background: transparent;
  border: none;
}

.show-addresses-btn {
  background: #292929;
  border: none;
  padding: 1rem;
  color: white;
  border-radius: 3rem;
  font-weight: 700;
}

.red-bg {
  background-color: #292929
}

.message {
  padding: 1rem;
  font-weight: 600;
  text-align: center;

  strong {
    margin-right: 1rem;
    font-weight: 400;
  }
}
</style>