// @ts-nocheck
import React, { useEffect, useRef, useCallback } from "react";
import Plotly from "plotly.js/dist/plotly";

const eventNames = [
  "AfterExport",
  "AfterPlot",
  "Animated",
  "AnimatingFrame",
  "AnimationInterrupted",
  "AutoSize",
  "BeforeExport",
  "BeforeHover",
  "ButtonClicked",
  "Click",
  "ClickAnnotation",
  "Deselect",
  "DoubleClick",
  "Framework",
  "Hover",
  "LegendClick",
  "LegendDoubleClick",
  "Relayout",
  "Relayouting",
  "Restyle",
  "Redraw",
  "Selected",
  "Selecting",
  "SliderChange",
  "SliderEnd",
  "SliderStart",
  "SunburstClick",
  "Transitioning",
  "TransitionInterrupted",
  "Unhover",
  "WebGlContextLost",
];

const updateEvents = [
  "plotly_restyle",
  "plotly_redraw",
  "plotly_relayout",
  "plotly_relayouting",
  "plotly_doubleclick",
  "plotly_animated",
  "plotly_sunburstclick",
];

const isBrowser = typeof window !== "undefined";

interface PlotlyComponentProps {
  className?: string;
  config?: any;
  data?: any[];
  debug?: boolean;
  divId?: string;
  frames?: any[];
  layout?: any;
  onError?: (err: any) => void;
  onInitialized?: (figure: any, graphDiv: any) => void;
  onPurge?: (figure: any) => void;
  onUpdate?: (figure: any, graphDiv: any) => void;
  revision?: number;
  style?: React.CSSProperties;
  useResizeHandler?: boolean;
}

export default function PlotlyComponent(props: PlotlyComponentProps) {
  const {
    data = [],
    layout,
    config,
    frames,
    revision,
    onInitialized,
    onPurge,
    onError,
    onUpdate,
    debug = false,
    useResizeHandler = false,
    style = { position: "relative", display: "inline-block" },
    className,
    divId,
  } = props;
  const plotRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const eventHandlersRef = useRef({});

  const getPlotlyEventName = useCallback(
    (eventName) => `plotly_${eventName.toLowerCase()}`,
    []
  );

  const updatePlotly = useCallback(
    (
      shouldInvokeResizeHandler,
      figureCallbackFunction,
      shouldAttachUpdateEvents
    ) => {
      if (!plotRef.current) return;

      Plotly.react(plotRef.current, {
        data,
        layout,
        config,
        frames,
      })
        .then(() => {
          if (shouldInvokeResizeHandler && resizeHandlerRef.current) {
            resizeHandlerRef.current();
          }
          syncEventHandlers();
          figureCallback(figureCallbackFunction);
          if (shouldAttachUpdateEvents) {
            attachUpdateEvents();
          }
        })
        .catch((err) => {
          if (onError) {
            onError(err);
          }
        });
    },
    [data, layout, config, frames, onError]
  );

  const syncWindowResize = useCallback(
    (invoke) => {
      if (!isBrowser) return;

      if (useResizeHandler && !resizeHandlerRef.current) {
        resizeHandlerRef.current = () => Plotly.Plots.resize(plotRef.current);
        window.addEventListener("resize", resizeHandlerRef.current);
        if (invoke) {
          resizeHandlerRef.current();
        }
      } else if (!useResizeHandler && resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
    },
    [useResizeHandler]
  );

  const figureCallback = useCallback((callback) => {
    if (typeof callback === "function" && plotRef.current) {
      const { data, layout } = plotRef.current;
      const frames = plotRef.current._transitionData
        ? plotRef.current._transitionData._frames
        : null;
      const figure = { data, layout, frames };
      callback(figure, plotRef.current);
    }
  }, []);

  const attachUpdateEvents = useCallback(() => {
    if (!plotRef.current || !plotRef.current.on) return;

    updateEvents.forEach((updateEvent) => {
      plotRef.current.on(updateEvent, handleUpdate);
    });
  }, []);

  const removeUpdateEvents = useCallback(() => {
    if (!plotRef.current || !plotRef.current.removeListener) return;

    updateEvents.forEach((updateEvent) => {
      plotRef.current.removeListener(updateEvent, handleUpdate);
    });
  }, []);

  const handleUpdate = useCallback(() => {
    figureCallback(onUpdate);
  }, [figureCallback, onUpdate]);

  const syncEventHandlers = useCallback(() => {
    eventNames.forEach((eventName) => {
      const prop = props[`on${eventName}`];
      const handler = eventHandlersRef.current[eventName];
      const hasHandler = Boolean(handler);

      if (prop && !hasHandler) {
        addEventHandler(eventName, prop);
      } else if (!prop && hasHandler) {
        removeEventHandler(eventName);
      } else if (prop && hasHandler && prop !== handler) {
        removeEventHandler(eventName);
        addEventHandler(eventName, prop);
      }
    });
  }, [props]);

  const addEventHandler = useCallback(
    (eventName, prop) => {
      eventHandlersRef.current[eventName] = prop;
      plotRef.current.on(
        getPlotlyEventName(eventName),
        eventHandlersRef.current[eventName]
      );
    },
    [getPlotlyEventName]
  );

  const removeEventHandler = useCallback(
    (eventName) => {
      plotRef.current.removeListener(
        getPlotlyEventName(eventName),
        eventHandlersRef.current[eventName]
      );
      delete eventHandlersRef.current[eventName];
    },
    [getPlotlyEventName]
  );

  useEffect(() => {
    updatePlotly(true, onInitialized, true);
    return () => {
      figureCallback(onPurge);
      if (resizeHandlerRef.current && isBrowser) {
        window.removeEventListener("resize", resizeHandlerRef.current);
      }
      removeUpdateEvents();
      Plotly.purge(plotRef.current);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and clean up on unmount

  useEffect(() => {
    const numPrevFrames = frames && frames.length ? frames.length : 0;
    const numNextFrames =
      props.frames && props.frames.length ? props.frames.length : 0;

    const figureChanged = !(
      layout === props.layout &&
      data === props.data &&
      config === props.config &&
      numNextFrames === numPrevFrames
    );
    const revisionDefined = revision !== undefined;
    const revisionChanged = revision !== props.revision;

    if (
      !figureChanged &&
      (!revisionDefined || (revisionDefined && !revisionChanged))
    ) {
      return;
    }

    updatePlotly(false, onUpdate, false);
  }, [props, revision, layout, data, config, frames, updatePlotly, onUpdate]);

  useEffect(() => {
    syncWindowResize(false);
  }, [syncWindowResize]);

  return <div id={divId} style={style} ref={plotRef} className={className} />;
}
