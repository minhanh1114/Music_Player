const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const PLAYER_STORE_KEY ="CODER CODER"

const playlists = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd =$('.cd');
const playBtn = $('.btn-toggle-play');
const player =$('.player');
const progress = $('#progress');
const nextSongBtn = $('.btn-next');
const prevSongBtn = $('.btn-prev');
const randomSongBtn = $('.btn-random');
const repeatSongBtn = $('.btn-repeat');

const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    setting: JSON.parse(localStorage.getItem(PLAYER_STORE_KEY)) ||{},
    setConfig: function(key,value) {
        this.setting[key] = value;
        localStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(this.setting));
    },
   songs:[
    
    {
        name: 'Đồng Lúa',
        singer:'KICM',
        path:'./assets/song/Donglua.mp3',
        img: 'https://img.youtube.com/vi/TIAoLWQHBHg/0.jpg'
    },
    {
        name: 'Tĩnh Tâm',
        singer:'KICM',
        path:'./assets/song/tinhtam.mp3',
        img: 'https://img.youtube.com/vi/I-zKQDpusno/0.jpg'
    },
    {
        name: 'Trời Xanh',
        singer:'KICM',
        path:'./assets/song/troixanh.mp3',
        img: 'https://img.youtube.com/vi/mVkheYGAnG8/0.jpg'
    },
    {
        name: 'Rạng Đông',
        singer:'KICM',
        path:'./assets/song/rangdong.mp3',
        img: 'https://img.youtube.com/vi/0_iJlTzdiDk/0.jpg'
    },
    {
        name: 'Never Give It Up',
        singer:'Michael Rose',
        path:'./assets/song/lalala.mp3',
        img: 'https://i1.sndcdn.com/avatars-000731877745-05xi4o-t500x500.jpg'
    },
    {
        name: 'SoldOut',
        singer:'Hawk Nelson',
        path:'./assets/song/SoldOut.mp3',
        img: 'https://i1.sndcdn.com/artworks-000366877860-koc1df-t500x500.jpg'
    }
   ],
   render: function(){
    const html =this.songs.map((song,index) =>{
        return ` 
         <div class="song" data-song-id="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
         </div>`
    });
    playlists.innerHTML= html.join('');
    // console.log(playlists);

   },
   // định nhĩa thuộc tính cho object lấy ra song hiện tại
   defineProperty: function(){
    Object.defineProperty(this,'currentSong',{
        get:function(){
            return this.songs[this.currentIndex];
        }
    });
   },
   handleEvents: function(){


    //xử lí cd rotation
    const cdThumAnimate = cdThumb.animate([
        {transform:'rotate(360deg)'}
    ],{
        duration: 10000,
        iterations:Infinity  
        })
        cdThumAnimate.pause();




       const cdWidth = cd.offsetWidth;
       //xử lí cuộn scroll
    document.onscroll= function(){
        
        const crollTop = window.scrollY||document.documentElement.scrollTop;
        const newCdWidth = cdWidth -crollTop;
        
        cd.style.width = newCdWidth>0 ? newCdWidth +'px' : 0+'px';
        cd.style.opacity= newCdWidth/cdWidth;
    };
    // xử lí click play 
    playBtn.onclick= function(){
        if(app.isPlaying)
        {
            audio.pause();
            cdThumAnimate.pause();
            
        }
        else{
            audio.play();
            cdThumAnimate.play();

        }
    };
    // khu audio playing
    audio.onplay= function(){
        player.classList.add('playing');
        app.isPlaying=true;

        // console.log([listsong]);
        const listsong =$$('.song');
        listsong.forEach(song => {
            if(song.classList.contains('active'));
            {
                song.classList.remove('active');
            }
        } );
    
        listsong[app.currentIndex].classList.add('active');
        //xử lí khi item song is hidden
        setTimeout(function(){
        if(app.currentIndex == 0)
        {

            return listsong[app.currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
        }
        
            listsong[app.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        
        },300);
      


    };
    // khi đang pause audio
    audio.onpause= function(){
        player.classList.remove('playing');
        app.isPlaying=false;
    };
    //fixx bug croll progress
    progress.onmousedown = function(e){  
        audio.removeEventListener('timeupdate', app.loadproger);
        
    };
    //kéo xong lại cho set value on progress
    progress.onmouseup = function(){  
        audio.addEventListener('timeupdate', app.loadproger);
        
    };

    // thanh progress sẽ load value lên
    audio.addEventListener('timeupdate',app.loadproger );
    
    progress.addEventListener('input', app.handleInputChange);
   
    //xử lí tua song trên thanh progress #k liên quan
    progress.onchange= function(e){
        const seekTime =audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;
    };
    // khi next Song
    nextSongBtn.onclick = function(){
        if(app.isRandom)
        {
            // nex Random song
            app.playRandomSong();
        }
        else
        {
            
            //next default song
            app.nextSong();
        }
        audio.play();
    };
    //khi prev song 
    prevSongBtn.onclick = function(){
        if(app.isRandom)
        {
            app.playRandomSong();
        }
        else
        {

            app.prevSong();
        }
        audio.play();
        // prevSongBtn.style.opacity = 0.8;
    };

    // xử lid random on off
    randomSongBtn.onclick = function(){
        app.isRandom=!app.isRandom;
        app.setConfig('isRandom',app.isRandom);
        //khi app.isRandom là true sẽ add khi false sẽ bỏ trong toggle
        randomSongBtn.classList.toggle("active",app.isRandom);
    };
    //xử lí khi audio kết thúc btn repeat
    audio.onended = function(){
        if(app.isRepeat)
        {
            audio.play();
        }
        else{

            nextSongBtn.click();
        }

    };
    // xử lí lặp lại 1 bài hát
    repeatSongBtn.onclick = function(){
        app.isRepeat=!app.isRepeat;
        app.setConfig('isRepeat',app.isRepeat);

        //khi app.isRandom là true sẽ add khi false sẽ bỏ trong toggle
        repeatSongBtn.classList.toggle("active",app.isRepeat);
    };

    playlists.onclick = function(e){
        // click vào 
        const songNode =e.target.closest('.song:not(.active)');
        if(songNode || !e.target.closest('.option'))
        {
            if(songNode)
            {
                app.currentIndex=songNode.getAttribute('data-song-id');
                app.loadCurrentSong();
                audio.play();
            }
            // xử lí khi vào option
        }

    };
},
    loadproger: function (){
        if(audio.duration)
        {
            const progressPercent = Math.floor(audio.currentTime/audio.duration * 100);
            progress.value = progressPercent;
            progress.style.backgroundSize = progress.value + '.1% 100%'
        }
    },
    // xử dụng cho event input
    handleInputChange: function () {
       
        progress.style.backgroundSize = progress.value + '% 100%'
      },
   

   loadCurrentSong: function(){
   
    
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
   },
   crollTopSongActive: function(){
    // const songactiv
   },
   nextSong: function(){
    this.currentIndex++;
    if(this.currentIndex > this.songs.length-1)
    {
        this.currentIndex = 0;
    }
    this.loadCurrentSong();
   },
   //prev Song 
   prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0)
    {
        this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
   },
   playRandomSong: function(){
    let newIndex; 
    do{
        newIndex = Math.floor(Math.random() * this.songs.length);


    }
    while(newIndex==this.currentIndex )
    this.currentIndex = newIndex;
    this.loadCurrentSong();

   },
   loadSettings: function(){
    this.isRandom = this.setting.isRandom;
    this.isRepeat = this.setting.isRepeat;
    repeatSongBtn.classList.toggle("active",app.isRepeat);
    randomSongBtn.classList.toggle("active",app.isRandom);



   },
   
   Autoclicks: function(){
    document.addEventListener("keydown", function(event){
        console.log(event);
      if(event.key ==="Enter")
      {
        playBtn.onclick();
      }
      else if(event.key ==="ArrowDown")
      {
        nextSongBtn.onclick();
      }
      else if(event.key ==="ArrowUp")  
      {
        prevSongBtn.onclick();
      }
      else if(event.key ==="Escape")  
      {
       
        window.close();
      }
    });
   },
    start: function() {
        this.loadSettings();
        this.defineProperty();
        this.handleEvents();
        this.loadCurrentSong(); //tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.render();
        this.Autoclicks();
    }
} 
app.start();


// thanh progreess





  


