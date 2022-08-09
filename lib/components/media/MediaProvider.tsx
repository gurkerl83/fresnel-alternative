import { createContext, FC, ReactNode } from 'react';

import { useMedia } from '../../hooks';
import { Media } from '../../types';
import { Boundary, useTheme } from './use-theme';

const defaultValue: Media = {
  active: true,
  isPending: false,
  className: ''
}

interface MediaMap {
  [key: string]: Media
}

const MediaContext = createContext<{
  media: MediaMap
}>({
  media: {
    mobile: defaultValue,
    desktop: defaultValue
  }
})

export const MediaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeMobile, isPendingMobile] = useMedia(
    'only screen and (max-width : 900px)'
  )
  const classNameMobile = useTheme(Boundary.upper)

  const [activeDesktop, isPendingDesktop] = useMedia(
    'only screen and (min-width : 900px)'
  )
  const classNameDesktop = useTheme(Boundary.lower)

  return (
    <MediaContext.Provider
      value={{
        media: {
          mobile: {
            active: activeMobile,
            isPending: isPendingMobile,
            className: classNameMobile
          },
          desktop: {
            active: activeDesktop,
            isPending: isPendingDesktop,
            className: classNameDesktop
          }
        }
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export const MediaConsumer = MediaContext.Consumer
