import { ReactNode, useEffect } from 'react';
import { ControlsCtx, CONTROLS_CTX_INIT_STATE } from './controls.context';

interface Props {
  children?: ReactNode;
}
const ControlsProvider = ({ children }: Props) => {

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseDown = () =>  {

    }

    const handleMouseMove = () =>  {

    }

    return () => {

    }
  }, [])

  return <ControlsCtx.Provider value={CONTROLS_CTX_INIT_STATE}>{children}</ControlsCtx.Provider>;
};

export { ControlsProvider };
