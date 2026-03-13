<template>
  <div class="recharge-page">
    <div class="header">
      <h1>鲸鱼live充值</h1>
    </div>

    <div class="logo-container">
      <img src="../img/logo.png" alt="Logo" class="logo" />
    </div>

    <div class="container">
      <!-- ID查询 -->
      <div class="search-box">
        <input
          v-model="userId"
          placeholder="请输入要充值的ID"
          class="search-input"
          @keyup.enter="queryUser"
        />
        <button class="search-btn" @click="queryUser">查询</button>
      </div>

      <!-- 用户信息 -->
      <transition name="fade">
        <div v-if="userInfo" class="user-info">
          <img :src="userInfo.avatar" class="avatar" />
          <div class="user-text">
            <div class="nickname">{{ userInfo.nickname }}</div>
            <div class="user-id">ID: {{ userInfo.id }}</div>
          </div>
        </div>
      </transition>

      <!-- 充值说明 -->
      <div class="ratio-tip">
        <div>人民币与钻石充值比例为1：10000</div>
        <div>即1元人民币=10000钻石</div>
      </div>

      <!-- 价格选择 -->
      <div class="price-list">
        <div
          v-for="item in priceOptions"
          :key="item.id"
          :class="['price-item', { selected: selectedPrice === item.id }]"
          @click="selectPrice(item)"
        >
          <div class="diamond">{{ item.diamond }}</div>
          <div class="price">{{ item.price }}</div>
        </div>
      </div>

      <!-- 充值按钮 -->
      <button class="submit-btn" @click="handleRecharge">确定充值</button>

      <!-- 温馨提示 -->
      <div class="tips">
        <div class="tips-title">温馨提示：</div>
        <p>• 请确保您填写的ID正确无误</p>
        <p>• 本服务仅面向年满18周岁的完全民事行为能力人，未成年人充值需监护人知情同意并全程监护。</p>
        <p>• 仅平台官方渠道充值有效，非官方渠道产生的一切损失与风险，本平台概不负责。</p>
        <p>• 充值兑换的平台虚拟币/道具，不支持兑现、退换、转让，法律法规另有规定除外。</p>
        <p>• 账号保管责任由用户自行承担，账号出借、被盗、保管不善导致的损失，平台不予赔付。</p>
        <p>• 违规/非法充值一经发现，平台有权处置账号、不予退还款项，并保留追责权利。</p>
      </div>
    </div>

    <!-- 自定义金额弹窗 -->
    <div v-if="showCustomModal" class="modal" @click="showCustomModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>自定义充值金额</h3>
          <button class="close" @click="showCustomModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <span class="symbol">¥</span>
            <input
              v-model.number="customAmount"
              type="number"
              placeholder="请输入金额"
              class="custom-input"
            />
          </div>
          <div class="diamond-result">
            获得钻石：{{ (customAmount * 10000).toLocaleString() }}
          </div>
        </div>
        <button class="modal-btn" @click="confirmCustomAmount">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

const userId = ref('')
const userInfo = ref(null)
const selectedPrice = ref(null)
const showCustomModal = ref(false)
const customAmount = ref('')
const customDiamond = ref('')
const customPrice = ref('')

const priceOptions = ref([
  { id: 1, diamond: '10万', price: '¥10', amount: 10 },
  { id: 2, diamond: '20万', price: '¥20', amount: 20 },
  { id: 3, diamond: '50万', price: '¥50', amount: 50 },
  { id: 4, diamond: '100万', price: '¥100', amount: 100 },
  { id: 5, diamond: '200万', price: '¥200', amount: 200 },
  { id: 6, diamond: '500万', price: '¥500', amount: 500 },
  { id: 7, diamond: '1000万', price: '¥1000', amount: 1000 },
  { id: 8, diamond: '2000万', price: '¥2000', amount: 2000 },
  { id: 9, diamond: '5000万', price: '¥5000', amount: 5000 },
  { id: 10, diamond: '自定义', price: '', amount: 0, isCustom: true }
])

const queryUser = () => {
  if (!userId.value) {
    showToast('请输入ID')
    return
  }
  userInfo.value = {
    id: userId.value,
    nickname: '鲸鱼用户' + userId.value,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId.value}`
  }
}

const selectPrice = (item) => {
  if (item.isCustom) {
    showCustomModal.value = true
  } else {
    selectedPrice.value = item.id
  }
}

const confirmCustomAmount = () => {
  if (!customAmount.value || customAmount.value <= 0) {
    showToast('请输入有效金额')
    return
  }
  if (customAmount.value < 10) {
    showToast('最低充值10元')
    return
  }
  const customOption = priceOptions.value.find(item => item.isCustom)
  if (customOption) {
    customOption.diamond = `${(customAmount.value * 10).toLocaleString()}万`
    customOption.price = `¥${customAmount.value}`
    customOption.amount = customAmount.value
  }
  selectedPrice.value = 10
  showCustomModal.value = false
}

const handleRecharge = () => {
  if (!userInfo.value) {
    showToast('请先查询用户')
    return
  }
  if (!selectedPrice.value) {
    showToast('请选择充值金额')
    return
  }
  showToast('充值成功')
}
</script>

<style scoped>
* {
  scrollbar-width: none;
}

*::-webkit-scrollbar {
  display: none;
}

.recharge-page {
  min-height: 100vh;
  background: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  background: white;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header h1 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding: 32px 0;
  background: #f5f7fa;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 16px;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-btn {
  padding: 12px 24px;
  background: #1989fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.user-text {
  flex: 1;
}

.nickname {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.user-id {
  font-size: 13px;
  color: #999;
}

.fade-enter-active {
  transition: opacity 0.3s;
}

.fade-enter-from {
  opacity: 0;
}

.ratio-tip {
  background: #fff3e0;
  color: #ff6b00;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
}

.price-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.price-item {
  background: white;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.price-item.selected {
  border-color: #1989fa;
  background: #e8f4ff;
}

.diamond {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.price {
  font-size: 16px;
  color: #ff6b00;
  font-weight: bold;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #1989fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
}

.tips {
  background: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.tips-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.tips p {
  margin: 6px 0;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 340px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
}

.modal-body {
  padding: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.symbol {
  font-size: 20px;
  color: #ff6b00;
  margin-right: 8px;
}

.custom-input {
  flex: 1;
  border: none;
  font-size: 24px;
  outline: none;
}

.diamond-result {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  color: #1989fa;
  font-size: 14px;
}

.modal-btn {
  width: 100%;
  padding: 12px;
  background: #1989fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  margin: 0 16px 16px;
  width: calc(100% - 32px);
}
</style>

