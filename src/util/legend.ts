import { deepMix, isString, map, size } from '@antv/util';
import View from '../chart/view';
import { DIRECTION } from '../constant';
import { Attribute, Tick } from '../dependents';
import Geometry from '../geometry/base';
import { LegendItem } from '../interface';
import { getMappingValue } from './attr';
import { MarkerSymbols } from './marker';

/**
 * @ignore
 * get the legend layout from direction
 * @param direction
 * @returns layout 'horizontal' | 'vertical'
 */
export function getLegendLayout(direction: DIRECTION): 'vertical' | 'horizontal' {
  return direction.startsWith(DIRECTION.LEFT) || direction.startsWith(DIRECTION.RIGHT) ? 'vertical' : 'horizontal';
}

/**
 * @ignore
 * get the legend items
 * @param view
 * @param geometry
 * @param attr
 * @param themeMarker
 * @param userMarker
 * @returns legend items
 */
export function getLegendItems(
  view: View,
  geometry: Geometry,
  attr: Attribute,
  themeMarker: object,
  userMarker,
): any[] {
  const scale = attr.getScale(attr.type);
  if (scale.isCategory) {
    const field = scale.field;

    return map(scale.getTicks(), (tick: Tick): object => {
      const { text, value: scaleValue } = tick;
      const name = text;
      const value = scale.invert(scaleValue);

      // 通过过滤图例项的数据，来看是否乣 unchecked
      const unchecked = !size(view.filterFieldData(field, [{ [field]: value }]));

      const colorAttr = geometry.getAttribute('color');
      const shapeAttr = geometry.getAttribute('shape');

      // @ts-ignore
      const color = getMappingValue(colorAttr, value, view.getTheme().defaultColor);
      const shape = getMappingValue(shapeAttr, value, 'point');
      let marker = geometry.getShapeMarker(shape, {
        color,
        isInPolar: geometry.coordinate.isPolar,
      });
      // the marker configure order should be ensure
      marker = deepMix({}, themeMarker, marker, userMarker);

      const symbol = marker.symbol;
      if (isString(symbol) && MarkerSymbols[symbol]) {
        marker.symbol = MarkerSymbols[symbol];
      }

      return { id: value, name, value, marker, unchecked };
    });
  }
  return [];
}

/**
 * @ignore
 * custom legend 的 items 获取
 * @param themeMarker
 * @param userMarker
 * @param customItems
 */
export function getCustomLegendItems(themeMarker: object, userMarker: object, customItems: LegendItem[]) {
  // 如果有自定义的 item，那么就直接使用，并合并主题的 marker 配置
  return map(customItems, (item: LegendItem) => {
    const marker = deepMix({}, themeMarker, userMarker, item.marker);
    const symbol = marker.symbol;
    if (isString(symbol) && MarkerSymbols[symbol]) {
      marker.symbol = MarkerSymbols[symbol];
    }

    item.marker = marker;
    return item;
  });
}
