import { transform } from '@antv/matrix-util';
import { IGroup, IShape } from '../dependents';

export { transform } from '@antv/matrix-util';

/**
 * 对元素进行平移操作。
 * @param element 进行变换的元素
 * @param x x 方向位移
 * @param y y 方向位移
 */
export function translate(element: IGroup | IShape, x: number, y: number) {
  const matrix = transform(element.getMatrix(), [['t', x, y]]);
  element.setMatrix(matrix);
}

/**
 * 对元素进行旋转操作。
 * @param element 进行变换的元素
 * @param rotateRadian 旋转弧度
 */
export function rotate(element: IGroup | IShape, rotateRadian: number) {
  const { x, y } = element.attr();
  const matrix = transform(element.getMatrix(), [
    ['t', -x, -y],
    ['r', rotateRadian],
    ['t', x, y],
  ]);
  element.setMatrix(matrix);
}

/**
 * 获取元矩阵。
 * @returns identity matrix
 */
export function getIdentityMatrix(): number[] {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

/**
 * 围绕图形中心点进行缩放
 * @param element 进行缩放的图形元素
 * @param ratio 缩放比例
 */
export function zoom(element: IGroup | IShape, ratio: number) {
  const bbox = element.getBBox();
  const x = (bbox.minX + bbox.maxX) / 2;
  const y = (bbox.minY + bbox.maxY) / 2;
  element.applyToMatrix([x, y, 1]);

  const matrix =  transform(element.getMatrix(), [
    ['t', -x, -y],
    ['s', ratio, ratio],
    ['t', x, y],
  ]);
  element.setMatrix(matrix);
}
