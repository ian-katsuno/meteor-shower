import { 
  useRef, 
  useState, 
  useCallback, 
  useEffect 
} from 'react';

export default function useMedia(
  type = 'audio',
){
  const player = useRef(document.createElement(type));

  useEffect(() => {
    return () => player.current.dispose();
  }, []);

  const [ isPlaying, setIsPlaying ] = useState(false);

  const setSrc = useCallback(src => {
    player.current.src = src;
    player.current.load();
  }, [ player ]);

  const play = useCallback(() => {
    setIsPlaying(true)
    return player.current
            .play()
            .catch(err => {
              console.error(err);
              setIsPlaying(false);
            })
  },[player])

  const pause = useCallback(() => {
    player.current.pause()
    setIsPlaying(false);
  }, [player]);

  const setOnFinish = useCallback((_onFinish) => {
    player.current.onended = _onFinish;
  }, [player])

  const setRef = useCallback((elem) => {
    player.current = elem;
  });

  return { play, pause, isPlaying, setSrc, setOnFinish, setRef }
}