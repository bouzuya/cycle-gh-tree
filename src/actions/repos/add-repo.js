import { Observable } from 'rx';

export default function({ DOM }) {
  const enterKeyCode = 13;
  const addRepo$ = Observable.merge(
    DOM.select('button.add').events('click'),
    DOM.select('input.user').events('keydown')
      .filter(i => i.keyCode === enterKeyCode),
    DOM.select('input.repo').events('keydown')
      .filter(i => i.keyCode === enterKeyCode)
  );
  return { addRepo$ };
}
