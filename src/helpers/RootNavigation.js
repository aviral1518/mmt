import * as React from 'react';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const queue = [];

const addToQueue = (data) => queue.push(data);

export const executeQueue = () =>
  setTimeout(
    () =>
      queue.forEach((data) =>
        navigationRef.current.navigate(data.name, data.params),
      ),
    100,
  );

export function navigate(name, params) {
  if (
    isReadyRef.current &&
    navigationRef.current &&
    navigationRef.current.getRootState() !== undefined
  ) {
    navigationRef.current.navigate(name, params);
  } else {
    addToQueue({name, params});
    console.log("App hasn't mounted yet");
  }
}
