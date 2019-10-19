const orgTree = [
  {
    label: '总经办',
    id: '1',
    persons: [
      {
        userName: '王力宏',
        userId: '1-1',
      },
      {
        userName: '张震岳',
        userId: '1-2',
      },
    ],
    children: [
      {
        label: '市场1部',
        id: '2-1',
        pid: '1',
        children: [
          {
            label: '运营部',
            id: '2-1-1',
            pid: '2-1',
            children: [
              {
                label: '公众平台',
                id: '2-1-1-1',
                pid: '2-1-1',
              },
              {
                label: '抖音',
                id: '2-1-1-2',
                pid: '2-1-1',
              },
              {
                label: '微博',
                id: '2-1-1-3',
                pid: '2-1-1',
              },
              {
                label: '文案部',
                id: '2-1-1-4',
                pid: '2-1-1',
              },
              {
                label: '创意部',
                id: '2-1-1-5',
                pid: '2-1-1',
              },
              {
                label: '执行部',
                id: '2-1-1-6',
                pid: '2-1-1',
              },
              {
                label: '策划部',
                id: '2-1-1-',
                pid: '2-1-1',
              },
            ],
          },
        ],
      },
      {
        label: '技术1部',
        id: '2-2',
        pid: '1',
        children: [
          {
            label: '前端',
            id: '2-2-1',
            pid: '2-2',
          },
          {
            label: '后端',
            id: '2-2-2',
            pid: '2-2',
          },
          {
            label: '运维',
            id: '2-2-3',
            pid: '2-2',
          },
        ],
      },
      {
        label: '综合管理部',
        id: '2-3',
        pid: '1',
        children: [
          {
            label: '人力资源中心',
            id: '2-3-1',
            pid: '2-3',
            children: [
              {
                label: '员工关系',
                id: '2-3-1-1',
                pid: '2-3-1',
              },
              {
                label: '薪酬福利',
                id: '2-3-1-2',
                pid: '2-3-1',
              },
              {
                label: '招聘',
                id: '2-3-1-3',
                pid: '2-3-1',
              },
              {
                label: '绩效',
                id: '2-3-1-4',
                pid: '2-3-1',
              },
            ],
          },
          {
            label: '行政中心',
            id: '2-3-2',
            pid: '2-3',
          },
        ],
      },
      {
        label: '财务部',
        id: '2-4',
        pid: '1',
        children: [],
      },
      {
        label: '保卫部',
        id: '2-5',
        pid: '1',
        children: [
          {
            label: '巡逻队',
            id: '2-5-1',
            pid: '2-5',
          },
          {
            label: '护卫队',
            id: '2-5-2',
            pid: '2-5',
          },
          {
            label: '安检队',
            id: '2-5-3',
            pid: '2-5',
          },
        ],
      },
      {
        label: '技术2部',
        id: '2-6',
        pid: '1',
        children: [],
      },
      {
        label: '技术3部',
        id: '2-7',
        pid: '1',
        children: [],
      },
      {
        label: '市场2部',
        id: '2-8',
        pid: '1',
        children: [],
      },
      {
        label: '客服中心',
        id: '2-9',
        pid: '1',
        children: [],
      },
    ],
  },
];

export default orgTree;
