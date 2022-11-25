import { GNode } from '@typings/graph';
import { autoId } from '@utils/autoId.util';
import { makeNode } from './makeNode.util';
import { CodeInsertAtLineNode, CodeInsertNode, CodeSetLineNode, OnKeyPressNode, OnMouseClickNode, OnStartNode, WaitNode } from './nodes';

export const getExampleGraph = (): GNode[] => {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const nodes: GNode[] = [];

  const startId = autoId();
  const insert1Id = autoId();
  const mouseClick1Id = autoId();
  const setCode1Id = autoId();
  const onKeyDown1Id = autoId();
  const setCode2Id = autoId();
  const wait1Id = autoId();
  const insertAtLine1Id = autoId();

  nodes.push(
    makeNode({
      id: startId,
      x: 135,
      y: h - 250,
      comp: OnStartNode,
      settings: {},
      nextNodesIds: [insert1Id],
      prevNodesIds: [],
    })
  );

  nodes.push(
    makeNode({
      id: insert1Id,
      x: 50,
      y: h - 100,
      comp: CodeInsertNode,
      settings: {
        code: ['const add = () => {', '', '}'].join('\n'),
      },
      nextNodesIds: [mouseClick1Id],
      prevNodesIds: [startId],
    })
  );

  nodes.push(
    makeNode({
      id: mouseClick1Id,
      x: 410,
      y: h - 250,
      comp: OnMouseClickNode,
      settings: {},
      nextNodesIds: [setCode1Id],
      prevNodesIds: [insert1Id],
    })
  );

  nodes.push(
    makeNode({
      id: setCode1Id,
      x: 350,
      y: h - 100,
      comp: CodeSetLineNode,
      settings: {
        line: 1,
        code: 'const add = (a, b) => {',
      },
      nextNodesIds: [onKeyDown1Id],
      prevNodesIds: [mouseClick1Id],
    })
  );


  nodes.push(
    makeNode({
      id: onKeyDown1Id,
      x: 710,
      y: h - 250,
      comp: OnKeyPressNode,
      settings: {},
      nextNodesIds: [setCode2Id],
      prevNodesIds: [setCode1Id],
    })
  );

  nodes.push(
    makeNode({
      id: setCode2Id,
      x: 650,
      y: h - 100,
      comp: CodeSetLineNode,
      settings: {
        line: 2,
        code: '\treturn a + b',
      },
      nextNodesIds: [wait1Id],
      prevNodesIds: [onKeyDown1Id],
    })
  );

  nodes.push(
    makeNode({
      id: wait1Id,
      x: 720,
      y: h + 120,
      comp: WaitNode,
      settings: {
        duration: 1,
      },
      nextNodesIds: [insertAtLine1Id],
      prevNodesIds: [setCode2Id],
    })
  );

  nodes.push(
    makeNode({
      id: insertAtLine1Id,
      x: 300,
      y: h + 100,
      comp: CodeInsertAtLineNode,
      settings: {
        line: 1,
        code: '// Function that returns sum of a and b',
      },
      nextNodesIds: [],
      prevNodesIds: [wait1Id],
    })
  );

  return nodes;
};
