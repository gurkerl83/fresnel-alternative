import { useRouter } from 'next/router';
import React, { FC, ReactNode, Suspense, useEffect, useId, useState, useTransition } from 'react';

import { Media } from '../..';
import { isBrowser } from '../../utils';
import { Suspender } from './Suspender';

export interface SuspenseWrapperProps {
  media: Media
  children: ReactNode
}

/**
 * Background:
 * The feature available in React 17 for canceling out unused DOM elements got eliminated in React 18.
 * The only option for replicating the behavior is to use Suspense and selectively suspend currently
 * unused components through Suspense wrappers / Suspenders.
 *
 * In the context of the approach pursued by fresnel, a variant of a component set that matches
 * a current breakpoint renders; any unmatched component gets suspended.
 *
 * The task of the suspense wrapper component is to interrupt the suspense component
 * by necessary transition pauses.
 *
 * Important:
 * React 18 requires the use of a transition when a value enters a suspense boundary.
 * A Suspense boundary does not serve an API to suspend embedded components.
 *
 * The only way is to make a commitment to the Suspense boundary, this must be done within
 * a Suspense boundary, see component Suspender and its "active" property.
 *
 * The only way is to trigger a commitment to the suspense boundary within a suspense boundary,
 * reference component Suspender, and its "active" property.
 *
 * Note: The suspense wrapper component should be in user-land and not be part of a library
 * because Next specific logic is involved.
 */
export const SuspenseWrapper: FC<SuspenseWrapperProps> = ({
  media: { active, isPending: activeIsPending },
  children
}) => {
  const id = useId()

  const [, setRerenderSuspended] = useState(false)
  const [rerenderSuspendedIsPending, startRerenderSuspendedTransition] =
    useTransition()

  /**
   * Next specific state
   * Either required because there is a bug within the Nextjs router component or
   * a general requirement by the approach; see the suspender component for more information.
   */
  const { isReady } = useRouter()

  useEffect(() => {
    if (!active && isReady) {
      startRerenderSuspendedTransition(() => {
        setRerenderSuspended(value => !value)
      })
    }
  }, [active, isReady])

  return (
    !activeIsPending &&
    !rerenderSuspendedIsPending && (
      <Suspense fallback={null}>
        <Suspender id={id} freeze={!isBrowser() ? false : !active}>
          {children}
        </Suspender>
      </Suspense>
    )
  )
}
