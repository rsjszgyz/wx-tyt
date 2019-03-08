/**
 * @description animation library
 * @detail requestAnimationFrame
 * 1. duration
 * 2. from
 * 3. to
 * 4. type
 */

import Tween from './tween'

let animationId = -1
let stoppedAnimationId = animationId - 1

 const customAnimation = exports.customAnimation = {};

 customAnimation.to = function (duration, from, to, type, delay, completeCallback) {
  for (let prop in to) {
    setTimeout(function (prop) {
      return function () {
        TweenAnimation(from[prop], to[prop], duration, type, (value, complete) => {
          from[prop] = value
          if (complete && completeCallback) {
            completeCallback(value)
          }
        })
      }
    }(prop), delay * 1000)
  }
 }

// duration unit second

const TweenAnimation = exports.TweenAnimation = function TweenAnimation(from, to, duration, type, callback) {
   const selfAnimationId = ++animationId
   const frameCount = Math.ceil(duration * 1000 / 17)
   let start = -1
   
   const startTime = Date.now()
   let lastTime = Date.now()

   const options = {
     callback: function () {},
     type: 'Linear',
     duration: 300
   }

   if (callback) {
     options.callback = callback
   }

   if (type) {
     options.type = type
   }

   if (duration) {
     options.duration = duration
   }

   var arrKeyTween = options.type.split('.')

   let tweenFn

   if (arrKeyTween.length == 1) {
     tweenFn = Tween[arrKeyTween[0]]
   } else if (arrKeyTween.length == 2) {
     tweenFn = Tween[arrKeyTween[0]] && Tween[arrKeyTween[0]][arrKeyTween[1]]
   }

   const step = function step() {
     const currentTime = Date.now()
     const interval = currentTime - lastTime
     
     let fps
     if (interval) {
       fps = Math.ceil( 1000 / interval )
     } else {
       requestAnimationFrame(step)
       return
     }

     if (fps >= 30) {
       start++
     } else {
       const _start = Math.floor(interval / 17)
       start = start + _start
     }

     const value = tweenFn(start, from, to - from, frameCount)

     if (start <= frameCount && selfAnimationId > stoppedAnimationId) {
       // 动画继续
       options.callback(value)
       requestAnimationFrame(step)
     } else if (start > frameCount && selfAnimationId > stoppedAnimationId) {
       // 动画结束
       options.callback(to, true)
     }

     lastTime = Date.now()
   }

   step()
 }

 const stopAllAnimation = exports.stopAllAnimation = function stopAllAnimation () {
   stoppedAnimationId = animationId
 }