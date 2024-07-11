import { fromA } from './a';
import { fromB } from './b';

export function fromC() {
  const value = fromA();
  const doubled = fromB(value);

  console.log(doubled);
  return doubled;
}