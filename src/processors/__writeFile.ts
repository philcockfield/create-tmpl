// import { Observable, Subject, BehaviorSubject } from 'rxjs';
// import {
//   takeUntil,
//   take,
//   takeWhile,
//   map,
//   filter,
//   share,
//   delay,
//   distinctUntilChanged,
// } from 'rxjs/operators';

// import { time } from '../common';

// import {
//   // IBeforeWriteFile,
//   // IBeforeWriteFileEvent,
//   ITemplateFile,
//   ITemplateEvent,
// } from '../types';

// // type T = ITemplateEvent;

// export type IBeforeWriteFile = {
//   file: ITemplateFile;
// };

// /**
//  *
//  */
// // export const writeFile = (fn: (e: IBeforeWriteFile) => void) => <
// //   T extends ITemplateEvent
// // >(
// //   source: Observable<T>,
// // ) => {
// //   return new Observable<T>(observer => {
// //     return source.subscribe({
// //       next(x) {
// //         console.log('next', x)
// //         // if (count++ % n === 0) observer.next(x);
// //       },
// //       error(err) { observer.error(err); },
// //       complete() { observer.complete(); }
// //     })

// // })

// export type WriteFileHandler = (e: IBeforeWriteFile) => void;

// export const writeFile = (fn: WriteFileHandler) => <T extends ITemplateEvent>(
//   source: Observable<T>,
// ) => {
//   return new Observable<T>(observer => {
//     // let count = 0;
//     return source.subscribe({
//       next: e => {
//         console.log('🌳 next', e.payload.file.path);
//         // if (count++ % n === 0) observer.next(x);
//         observer.next(e);
//         // observer.complete();
//       },
//       error: err => observer.error(err),
//       complete: () => observer.complete(),
//     });
//   });
// };
