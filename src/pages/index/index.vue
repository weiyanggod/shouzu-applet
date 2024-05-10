<template>
	<view>
		<view class="background">
			<view class="text">首页</view>
			<img src="@/static/index/首页背景.png" />
		</view>
		<view class="page">
			<view class="swiper">
				<u-swiper height="100%" class="swiper" :list="swiperList"></u-swiper>
			</view>
			<view class="box">
				<view class="item" v-for="(item, index) in list" :key="index" @click="to(item)">
					<img :src="item.img" style="width: 68px; height: 68px" />
					<view>{{ item.text }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Navigation from '@/components/navigation'
import { loginApi } from '@/api/index.js'
export default {
	components: { Navigation },
	data() {
		return {
			swiperList: [require('@/static/index/轮播图2.png')],
			list: [
				{
					text: '立即绑定',
					img: '/static/index/立即绑定.png'
				},
				{
					text: '缴费通知',
					img: '/static/index/缴费通知.png'
				},
				{
					text: '立即缴费',
					img: '/static/index/立即缴费.png'
				}
			]
		}
	},
	created() {},
	methods: {
		async to(data) {
			const app = getApp()
			const code = await app.getCode()
			if (data.text === '立即绑定') {
				uni.navigateTo({ url: '/pages/binding/binding' })
			}
			if (data.text === '缴费通知') {
				loginApi({ code }).then((res) => {
					if (res.state !== 0) {
						this.showModal(res.message)
					} else {
						uni.setStorageSync('token', res.data.token)
						uni.navigateTo({ url: '/pages/payInfo/payInfo' })
					}
				})
			}
			if (data.text === '立即缴费') {
				loginApi({ code }).then((res) => {
					if (res.state !== 0) {
						this.showModal(res.message)
					} else {
						uni.setStorageSync('token', res.data.token)
						uni.navigateTo({ url: '/pages/pay/pay' })
					}
				})
			}
		},
		showModal() {
			uni.showModal({
				title: '提示!',
				content: '请先绑定合同',
				showCancel: false,
				confirmText: '确定'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.background {
	width: 100%;
	height: 375px;
	position: fixed;
	top: 0;
	z-index: -1;
	img {
		width: 100%;
		height: 100%;
	}
	.text {
		position: fixed;
		left: 50%;
		transform: translate(-50%);
		top: 7%;
	}
}
.page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 100px;
	.swiper {
		width: 350px;
		height: 192px;
	}
	.box {
		width: 350px;
		height: 115px;
		background: linear-gradient(180deg, rgba(223, 241, 255, 1) 2%, rgba(255, 255, 255, 0.8) 100%);
		box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
		margin-top: 10px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;

		.item {
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}
	}
}
</style>
