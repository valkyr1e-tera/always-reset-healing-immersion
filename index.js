module.exports = function AlwaysResetHealingImmersion(mod) {
  let reset = false
  mod.hook('S_CREST_MESSAGE', 2, { order: Number.NEGATIVE_INFINITY }, ({ type, skill }) => {
    if (type === 6 && skill === 370200)
      reset = true
  })

  mod.hook('C_START_SKILL', 7, { order: Number.NEGATIVE_INFINITY, filter: { fake: null } }, event => {
    if (mod.game.me.class !== 'priest')
      return

    if (event.skill.id === 370200) {
      mod.hookOnce('S_ACTION_STAGE', 9, () => {
        if (reset) {
          reset = false
        } else {
          mod.hookOnce('S_ACTION_END', 5, () => {
            mod.send('C_START_SKILL', 7, event)
          })
          mod.send('C_CANCEL_SKILL', 3, { skill: event.skill, type: 1 })
        }
      })
    }
  })
}