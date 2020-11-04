import React, {useState, useRef, useEffect, useCallback} from 'react'

import { 
    CaptionIcon, CastIcon, EpisodeIcon,
    FastFowardIcon, FullVolumeIcon, HelpIcon, 
    MaximizeIcon, NextIcon, PausedIcon, 
    PlayIcon, RewindIcon, VolumeMutedIcon, MinimizeIcon
    } 
        from './Icon'
import "./index.css"

const VideoPlayer = () => {

    //Varibales
    const videoContainer = useRef(null)
    const video = useRef(null)
    const watchedBar = useRef(null)
    const progressBar = useRef(null)
    const controlsContainer = useRef(null)
    const [videoDuration, setVideoDuration] = useState('--:--')
    const [realTime, setRealTime] = useState('00:00')
    const [videoPlaying, setVideoPlaying] = useState('http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4')
    const [playlist, setPlaylist] = useState(null)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [pipMode, setPipMode] = useState(false)
    let controlsTimeout;


    const toggleMute = useCallback(() => {
        video.current.muted = !video.current.muted;
        setMuted(muted => !muted)
    }, [video]);


    const CountTime = useCallback(() =>  {

        watchedBar.current.style.width = ((video.current.currentTime / video.current.duration) * 100) + '%';
        const totalDuration = video.current.duration
    
        const timeDuration = new Date(null)
        timeDuration.setSeconds(totalDuration)
        let VideoHours = null
        if(totalDuration >= 3600){
            VideoHours = (timeDuration.getHours().toString()).padStart('2', '0')
        }
        let Videominutes = (timeDuration.getMinutes().toString()).padStart('2', '0');
        let Videoseconds = (timeDuration.getSeconds().toString()).padStart('2', '0');
        
        setVideoDuration(`${VideoHours ? ':' +VideoHours : ''}${Videominutes}:${Videoseconds}`)
       
        
        const time = new Date(null);
        time.setSeconds(video.current.currentTime);
        let hours = null;
        if(video.current.currentTime >= 3600) {
            hours = (time.getHours().toString()).padStart('2', '0');
        }                
        let minutes = (time.getMinutes().toString()).padStart('2', '0');
        let seconds = (time.getSeconds().toString()).padStart('2', '0');
        setRealTime(`${hours ? ':'+hours : ''}${minutes}:${seconds}`);
    }, [video, watchedBar])

    useEffect(() => {
        if(video){
    
            watchedBar.current.style.width = '0px';
            
            let updateTime = video.current.addEventListener('timeupdate', CountTime);
            // document.addEventListener('mousemove', () => {
            //     displayControls();
            // });
            document.addEventListener('keyup', (event) => {
                if (event.code === 'Space') {
                    TogglePlay(); 
                }
                
                if (event.code === 'KeyM') {
                    toggleMute();
                }
                
                if (event.code === 'KeyF') {
                    toggleFullScreen();
                }
                
                // displayControls();
            });
        }

    }, [CountTime, toggleMute, video])

    useEffect(() => {
        if(watchedBar){
            // watchedBar.current.style.width = '0px';
            // controlsContainer.current.style.opacity = '0';

        }
      
    }, [watchedBar])

   
    
    const displayControls = () => {
        controlsContainer.current.style.opacity = '1';
        document.body.style.cursor = 'initial';
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controlsContainer.current.style.opacity = '0';
            document.body.style.cursor = 'none';
        }, 5000);
    };
    

    const togglePictureinPicture = (container) => {
        if(!pipMode){
            container.requestPictureInPicture()
            setPipMode(true)
        }else{
            container.exitPictureInPicture()
            setPipMode(false)
        }
    }
    
    const changeProgressBarPositon = (event) => {
        const pos = (event.pageX  - (progressBar.current.offsetLeft + progressBar.current.offsetParent.offsetLeft)) / progressBar.current.offsetWidth;
        video.current.currentTime = pos * video.current.duration;
    }
    
    const TogglePlay = () => {
        if (video.current.paused) {
          video.current.play();
          setPlaying(true)
        } else {
            video.current.pause(); 
            setPlaying(false)
        }
    }

    
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            if (videoContainer.current.requestFullscreen()) {
                videoContainer.current.requestFullscreen();
              } else if (videoContainer.current.webkitRequestFullscreen) { /* Safari */
                videoContainer.current.webkitRequestFullscreen();
              } else if (videoContainer.current.msRequestFullscreen) { /* IE11 */
                videoContainer.current.msRequestFullscreen();
            }
            setFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
            setFullscreen(false)
        }
    };

    return (
        <div className="VideoPlayer">
            <div className="video-container" ref={videoContainer}>   
            <video src={videoPlaying} ref={video} ></video>
                <div className="controls-container" ref={controlsContainer}>
                    <div className="progress-controls">
                        <div className="progress-bar" ref={progressBar} onClick={changeProgressBarPositon}>
                            <div className="watched-bar" ref={watchedBar}></div>
                            {/* <div className="playhead"></div> */}
                        </div>
                   
                    </div>
                    <div className="controls">

                        <div className="controls-right">
                             <button className="rewind control-button">        
                                <RewindIcon onClick={() => video.current.currentTime -= 10}/>
                            </button>
                            <button className="play-pause control-button">
                                {
                                    playing ? 
                                    <PausedIcon onClick={TogglePlay}/> :  
                                    <PlayIcon onClick={TogglePlay}/>
                                }
                            </button>
                            <button className="fast-forward control-button">           
                                <FastFowardIcon onClick={() => video.current.currentTime += 10}/>
                            </button>
                            <button className="duration control-button">
                                {realTime}/{videoDuration}
                                {/* <span className="time-duration">{realTime}/</span><span className="time-duration">{videoDuration}</span> */}
                            </button>
                            <button className="volume control-button">   
                                {
                                    muted ? 
                                    <VolumeMutedIcon onClick={toggleMute}/>  : 
                                    <FullVolumeIcon onClick={toggleMute}/>
                                }
                            </button>
                        </div>
                        
                
                        <div className="controls-left">
                            <button className="episodes control-button">            
                                <EpisodeIcon/>
                            </button>
                            <button className="captions control-button">            
                                <CaptionIcon/>
                            </button>
                            <button className="cast control-button">        
                            <CastIcon/>
                            </button>
                            <button className="full-screen control-button">
                                {
                                    fullscreen ? 
                                    <MinimizeIcon onClick={toggleFullScreen} /> :  
                                    <MaximizeIcon onClick={toggleFullScreen}/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer

