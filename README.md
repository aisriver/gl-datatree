<h1 align="center">gl-datatree</h1>

<p align="center">
基于 threejs 封装的 3D 树可视化组件
<br/>
webgl 3d data tree.
</p>

<p align="center">
    <img width="600" src="https://github.com/aisriver/gl-datatree/raw/master/src/assets/datatree.png">
</p>

# 简介

数据可视化方面，二维方面的组件早已形成一个完整、成熟的体系；各类图表库层出不穷。
在三维方面，无论表达形式还是交互方式，都十分灵活，有着很大的拓展空间；
在三维世界里面，数据可视化要形成一个完整的体系，还需要很多探索。

gl-datatree 组件也许并不是一个很好的解决方案，但我把他当作是一次大胆的尝试。

# API

- init

  | 接收参数    | 返回内容                                    |
  | ----------- | ------------------------------------------- |
  | HTMLElement | object（setOption、updateTooltip、dispose） |

- setOption

  | 属性         | 类型    | 介绍                               | 是否必须         |
  | ------------ | ------- | ---------------------------------- | ---------------- |
  | title        | string  | 组件标题                           | 否               |
  | data         | array   | 见下面的 data type                 | 是               |
  | autoRotate   | boolean | 场景自动旋转                       | 否（默认 false） |
  | autoPlay     | boolean | 图例自动轮播                       | 否（默认 false） |
  | playInterval | number  | 自动轮播间隔时常（毫秒）           | 否（默认 3000）  |
  | listening    | object  | 回调监听事件 见下面 listening type | 否               |

  data type

  | 属性     | 类型          | 介绍                                       | 是否必须 |
  | -------- | ------------- | ------------------------------------------ | -------- |
  | label    | string        | 节点名称                                   | 是       |
  | id       | string number | 节点 ID                                    | 是       |
  | pid      | string number | 节点父级 ID                                | 是       |
  | children | array         | 子节点数据                                 | 否       |
  | position | object        | 自定义节点位置（第一个节点默认(0, 10, 0)） | 否       |

  listening type

  | 属性       | 类型                                                              | 介绍                 | 是否必须 |
  | ---------- | ----------------------------------------------------------------- | -------------------- | -------- |
  | onSelected | function (userData: object, domPosition: DomPositionType) => void | 鼠标移动到节点的回调 | 否       |

  DomPositionType

  | 属性    | 类型   | 介绍                                           | 是否必须        |
  | ------- | ------ | ---------------------------------------------- | --------------- |
  | x       | number | 三维对象映射到 document body 的 x 方向实际位置 | 是              |
  | y       | number | 三维对象映射到 document body 的 y 方向实际位置 | 是              |
  | offsetX | number | 显示 tooltip 的 x 方向偏移量                   | 否（默认值 20） |
  | offsetY | number | 显示 tooltip 的 y 方向偏移量                   | 否（默认值 15） |

  position type

  | 属性 | 类型   | 介绍              | 是否必须 |
  | ---- | ------ | ----------------- | -------- |
  | x    | number | 三维对象 x 轴位置 | 是       |
  | y    | number | 三维对象 y 轴位置 | 是       |
  | z    | number | 三维对象 z 轴位置 | 是       |

  showData type

  | 属性  | 类型   | 介绍   | 是否必须     |
  | ----- | ------ | ------ | ------------ |
  | label | string | 标签   | 是           |
  | value | string | number | 标签对应的值 | 是 |

- updateTooltip
  类型： function
  接收参数：
  title 图例标题
  showData 图例数据（Array） 见 showData type
  domPosition 图例位置
  功能： 更新内置 tooltip

- dispose
  类型： function
  功能： 释放组件内部对象

# use

## 📦 安装

```bash
npm install gl-datatree --save
```

```bash
yarn add gl-datatree
```

## 🔨 示例

你可以参考 github example 的示例

```jsx
import GlDataTree from 'gl-datatree';
```

```jsx
// 实例化
const glTree = new GlDataTree().init(HTMLElement);
glTree.setOption({
  title: '组织架构树',
  data: orgTree, // 节点数据
  autoRotate: false,
  autoPlay: true,
  listening: {
    onSelected: (userData, domPosition) => {
      const showData = []; // userData数据自定义处理
      // 你也可以不使用 updateTooltip 方法 创建自己的tooltip
      glTree.updateTooltip({
        title: userData.label,
        showData,
        domPosition,
      });
    },
  },
});
// 销毁
glTree.dispose();
```

# future

- 未来有可能提供的功能

  场景切换 、多种类节点位置计算方案、更多的事件监听、节点/连线样式自定义配置……

- 未来可能提供的其他组件

  3D 全方位雷达图、3D 拓扑图 、场景化抽象数据展示等

### github

[Jared](https://github.com/aisriver/gl-datatree.git)
