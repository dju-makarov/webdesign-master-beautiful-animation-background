const video = document.querySelector('video')

const swiperText = new Swiper('.swiper', {
	speed: 1600,
	mousewheel: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		prevEl: '.swiper-button-prev',
		nextEl: '.swiper-button-next',
	},
})

swiperText.on('slideChange', function () {
	gsap.to(video, 1.6, {
		currentTime: (video.duration / (this.slides.length - 1)) * this.realIndex,
		ease: Power2.easeOut,
	})
})

swiperText
	.on('slideChangeTransitionStart', function () {
		video.classList.add('change')
	})
	.on('slideChangeTransitionEnd', function () {
		video.classList.remove('change')
	})

document.addEventListener('DOMContentLoaded', function () {
	const video = document.querySelector('.video-background')
	const loadingScreen = document.getElementById('loading-screen')
	const progressBar = document.getElementById('progress')

	// Функция для загрузки видео
	async function loadVideo() {
		const response = await fetch('media/background.mp4')
		const reader = response.body.getReader()
		const contentLength = +response.headers.get('Content-Length')
		let receivedLength = 0
		const chunks = []

		while (true) {
			const { done, value } = await reader.read()

			if (done) {
				break
			}

			chunks.push(value)
			receivedLength += value.length

			// Обновление прогресс-бара
			const progressPercentage = (receivedLength / contentLength) * 100
			progressBar.style.width = progressPercentage + '%'
		}

		// Создание видео Blob после полной загрузки
		const videoBlob = new Blob(chunks)
		const videoURL = URL.createObjectURL(videoBlob)
		video.src = videoURL

		// Скрытие экрана загрузки
		progressBar.style.width = '100%'
		setTimeout(() => {
			loadingScreen.style.display = 'none'
		}, 500)
	}

	// Начинаем загрузку видео
	loadVideo()
})
