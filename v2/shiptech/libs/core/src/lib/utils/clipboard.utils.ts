import { fromEvent, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AppContext } from '../app-context/app-context';

export function copyIntoClipoard(value: any): void {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = value;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function copyToClipboardCtrlAltE(): Observable<any> {
  return fromEvent(window, 'keydown').pipe(
    filter((event: KeyboardEvent) => event.ctrlKey && event.altKey && event.code === 'KeyE'),
    tap(() => copyIntoClipoard(AppContext.instance.sessionId))
  );
}
