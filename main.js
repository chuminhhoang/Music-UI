const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

    const player = $('.player')
    const heading = $('header h2')
    const cdRadius = $('.cd-radius') 
    const audio = $('#audio')
    const cd = $('.cd')

    const playMusic = $('.btn-play')
    const process = $('#process')
    const next = $('.btn-next')
    const undo = $('.btn-undo')
    const random = $('.btn-random')
    const restart = $('.btn-restart')
    const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isResart: false,
    isNext: false,
    songs: [
        {
            name: 'Chia tay đi',
            singer: 'idol HP',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Tình yêu ảo ma',
            singer: 'idol Nink',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: '100 anh ny',
            singer: 'Quỳnh tụt tưng',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Độc thân có buồn?',
            singer: 'Nguyên - biến vừa vừa',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Quản lý em gái mưa',
            singer: 'idol HP',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Ảo ma canada',
            singer: 'Nink Nguyễn',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Yêu rồi cũng phải chia tay',
            singer: 'Nguyên Phiêu',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: '100 anh liệu là đủ?',
            singer: 'Quỳnh chưa có ny',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
    ],
    render: function() {
        // console.log(123);
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-img" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="song-icon">
                    <i class="fa fa-ellipsis-h"></i>
                </div>
            </div>
        
            `
        })
        playlist.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý cd quay và dừng
        const cdRadiusAnimate = cdRadius.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            interations: Infinity,
        })
        cdRadiusAnimate.pause()


        // Xử lý cd phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth > 0 ? newcdWidth  + 'px' : 0
            cd.style.opacity = (newcdWidth / cdWidth)

        }

        // Xử lý click play
        playMusic.onclick = function() {
            if(app.isPlaying) {
                
                audio.pause()
                
            } else {
                audio.play()
            }
        }
        //Khi bài hát đươc play
        audio.onplay = function() {
            player.classList.add('playing')
            app.isPlaying = true
            cdRadiusAnimate.play()
        }

        // Khi pause
        audio.onpause = function() {
            player.classList.remove('playing')
            app.isPlaying = false
            cdRadiusAnimate.pause()

        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const processPrecent = Math.floor(audio.currentTime / audio.duration * 100)
                process.value = processPrecent
            }
            
        }

        // Xử lý khi tua 
        process.oninput = function(e){
            // từ số phần trăm của giây convert sang giây
            const seekTime = audio.duration / 100 * e.target.value; 
            audio.currentTime = seekTime;
            audio.play();
        }

        // khi next song
        next.onclick = function() {
            if(app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
        }
        // khi undo song
        undo.onclick = function() {
            if(app.isRandom) {
                app.randomSong()
            } else {
                app.undoSong()
            }
            audio.play()
            app.render()
        }

        // Xử lý bật tắt icon radom
        random.onclick = function() {
            // console.log(app.isRandom);
            app.isRandom = !app.isRandom

            // Nếu true thì add, nếu false thì remove class
            random.classList.toggle('active', app.isRandom)
        } 

        
        // Xử lý lặp lại 1 bài hát
        restart.onclick = function() {
            app.isResart = !app.isResart
            // Nếu true thì add, nếu false thì remove class
            restart.classList.toggle('active', app.isResart)

            
        }

        // Next khi bài hát kết thúc
        audio.onended = function() {
            if(app.isResart) {
                audio.play()
            } else {
                next.click()
            }
        }

        // Click vào song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lý khi click vào song
            if( songNode || e.target.closest('.song-icon') ) {
                if( songNode ) {     
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }

    },
    loadCurrentSong: function() {  

        heading.textContent = this.currentSong.name
        cdRadius.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    undoSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        
        // Lắng nghe / xử lý các xử kiện (DOM Event)
        this.handleEvent()

        // Tảo thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        // Render lại playlist
        this.render()
    }
}
app.start()