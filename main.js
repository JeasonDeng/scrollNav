 // 实现导航滑动
  // 1.获取元素
  let nav = document.querySelector('.nav')
  let list = document.querySelector('ul')

  // 视口宽度
  const WIDTH = document.documentElement.clientWidth
  // 2.绑定 touch 事件 (3)

  // 手指点击的初始位置
  let startX = 0
  // list 的初始位置
  let startPos = 0
  // 手指移动的距离
  let dis = 0
  // 右侧的边界值
  let limitX = nav.clientWidth - list.offsetWidth

  // 移动后元素的位置
  let translateX = 0

  // 每一次 move 之前/后的时间
  let preTime = 0
  let nowTime = 0
  // 每一次 move 之前/后的位置
  let prePos = 0
  let nowPos = 0

  // 每次移动的速度
  let speed = 0

  nav.addEventListener('touchstart', function(e) {

    startX = e.touches[0].clientX
    startPos = list.style.transform ? parseInt(list.style.transform.slice(11)) : 0
    // 滑动开始重置过渡和速度
    list.style.transition = 'none'
    speed = 0

    // 记录初始时间/位置
    preTime = Date.now()
    prePos = startX

  })

  nav.addEventListener('touchmove', function(e) {
    let moveX = e.touches[0].clientX
    // 滑动系数
    let scale = 1
    // 手指移动距离
    dis = moveX - startX
    // 移动后元素的位置
    translateX = startPos + dis

    // 4.滑动边界处的橡皮问题(最左边最右边限制)
    if (translateX > 0) {
      // translateX = 0
      // 随着手指滑动scale 应该越来越小 (1~.5)
      scale = 1 - dis / (WIDTH * 2)
    } else if (translateX < limitX) {
      // dis 是负数
      scale = 1 + dis / (WIDTH * 2)
    }

    translateX = startPos + dis * scale

    // 3.根据滑动的距离设置导航的偏移量 translateX
    list.style.transform = 'translateX(' + translateX + 'px)'

    // 每次 move 之后的时间/位置
    nowTime = Date.now()
    nowPos = moveX
    // 这次移动的速度
    speed = (nowPos - prePos) / (nowTime - preTime)

    preTime = nowTime
    prePos = nowPos
    // console.log(speed)
  })

  nav.addEventListener('touchend', function(e) {
  	// 先获取元素位置
    let defPos = parseInt(list.style.transform.slice(11))
    // touchend 时的橡皮效果
    // 在原本位置上加上与速度相关的一个值
    // 如果是轻轻滑动，speed 设置为 0
    speed = Math.abs(speed) > 0.5 ? speed : 0
    console.log(speed)
    let endPos = defPos + speed * 200

    let bsr = ''

    let time = Math.abs(speed) * 0.2
    time = time < 0.3 ? 0.3 : (time > 2 ? 2 : time)

    // 4.滑动边界橡皮问题(最左边最右边限制)    
    if (endPos > 0) {
      endPos = 0
      bsr = 'cubic-bezier(.28,1.54,.73,1.32)'
    } else if (endPos < limitX) {
      endPos = limitX
      bsr = 'cubic-bezier(.28,1.54,.73,1.32)'
    }  

    list.style.transition = 'all '+ time +'s '+ bsr

    list.style.transform = 'translateX(' + endPos + 'px)'
  })


  // 5.橡皮筋效果
  //      在最左边和最右边滑动到一定距离要弹回最左最右位置
  //      快速滑动时，list 的快速移动