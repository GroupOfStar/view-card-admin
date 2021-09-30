import { defineComponent } from 'vue'
import styles from './Main.module.less'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'Main',
  setup() {
    return () => (
      <section class={styles.lc_main}>
        <RouterView></RouterView>
        也没啥三生三世
      </section>
    )
  },
})
