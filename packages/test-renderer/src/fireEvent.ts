import type { RootStore } from '@vue-three/fiber'

import { toEventHandlerName } from './helpers/strings'

import { VueThreeTestInstance } from './createTestInstance'

import type { Act, MockSyntheticEvent } from './types/public'
import type { MockEventData } from './types/internal'

export const createEventFirer = (act: Act, store: RootStore) => {
  const findEventHandler = (
    element: VueThreeTestInstance,
    eventName: string,
  ): ((event: MockSyntheticEvent) => unknown) | null => {
    const eventHandlerName = toEventHandlerName(eventName)

    const props = element.props

    if (typeof props[eventHandlerName] === 'function') {
      return props[eventHandlerName]
    }

    if (typeof props[eventName] === 'function') {
      return props[eventName]
    }

    console.warn(
      `Handler for ${eventName} was not found. You must pass event names in camelCase or name of the handler https://github.com/pmndrs/vue-three-fiber/blob/master/packages/test-renderer/markdown/vttr.md#create-fireevent`,
    )

    return null
  }

  const createSyntheticEvent = (element: VueThreeTestInstance, data: MockEventData): MockSyntheticEvent => {
    const raycastEvent = {
      camera: store.getState().camera,
      stopPropagation: () => {},
      target: element,
      currentTarget: element,
      sourceEvent: data,
      ...data,
    }
    return raycastEvent
  }

  const invokeEvent = async (
    element: VueThreeTestInstance,
    eventName: string,
    data: MockEventData,
  ): Promise<unknown> => {
    const handler = findEventHandler(element, eventName)

    if (!handler) {
      return
    }

    let returnValue: unknown

    await act(async () => {
      returnValue = handler(createSyntheticEvent(element, data))
    })

    return returnValue
  }

  const fireEvent = async (
    element: VueThreeTestInstance,
    eventName: string,
    data: MockEventData = {},
  ): Promise<unknown> => await invokeEvent(element, eventName, data)

  return fireEvent
}
