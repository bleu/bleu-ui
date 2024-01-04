import React from 'react';

export type ExampleProps = {
  text?: String;
};

export function Example(props: ExampleProps) {
  const [count, setCount] = React.useState(0);
  return (
    <button
      id="bleu-ui"
      onClick={() => setCount(count + 1)}
      type="button"
      className="bg-blue-500 font-bold text-xs"
    >
      {`${props.text} ${count}`}
    </button>
  );
}
