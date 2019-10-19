import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
const GlDataTree = require('../../build').default;
const orgTree = require('./testData').default;

function App() {
  const glRef = useRef(null);

  useEffect(() => {
    const glTree = new GlDataTree().init(glRef.current);
    glTree.setOption({
      title: '组织架构树',
      data: orgTree,
      autoRotate: false,
      autoPlay: false,
      listening: {
        onSelected: (userData: any, domPosition) => {
          const showData = [
            {
              label: '节点类型',
              value: userData.type,
            },
          ];
          if (userData.type === 'link') {
            showData.push(
              {
                label: 'fromID',
                value: userData.from,
              },
              {
                label: 'toID',
                value: userData.to,
              },
            );
          }
          if (userData.type === 'node') {
            const persons = userData.persons || [];
            if (persons.length > 0) {
              showData.push({
                label: '部门人员',
                value: persons.map((user: { userName: string }) => user.userName).join(','),
              });
            }
            showData.push({
              label: '层级',
              value: userData.level,
            });
          }
          glTree.updateTooltip({
            title: userData.label,
            showData,
            domPosition,
          });
        },
      },
    });
    return () => {
      glTree.dispose();
    };
  }, [glRef]);

  return <div style={{ width: '100%', height: '100vh' }} className="App" ref={glRef} />;
}

export default App;
