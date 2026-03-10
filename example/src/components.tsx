import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export const Page = defineComponent({
  name: 'Page',
  setup(_, { slots }) {
    return () => <div class="Page">{slots.default?.()}</div>
  },
})

export const DemoPanel = defineComponent({
  name: 'DemoPanel',
  setup(_, { slots }) {
    return () => <div class="DemoPanel">{slots.default?.()}</div>
  },
})

export const Dot = defineComponent({
  name: 'Dot',
  props: {
    to: { type: String, required: true },
  },
  setup(props, { slots }) {
    return () => (
      <RouterLink to={props.to} class="Dot">
        {slots.default?.()}
      </RouterLink>
    )
  },
})

export const Loading = defineComponent({
  name: 'Loading',
  setup() {
    return () => (
      <div class="LoadingContainer">
        <div class="LoadingMessage">Loading.</div>
      </div>
    )
  },
})

export const Error = defineComponent({
  name: 'ErrorDisplay',
  setup(_, { slots }) {
    return () => <div class="Error">{slots.default?.()}</div>
  },
})
