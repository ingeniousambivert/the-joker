import React from "react";
import Portal from "@reach/portal";

const style = {
  body: `flex-shrink flex-grow p-4`,
  headerTitle: `text-xl md:text-2xl font-light`,
  content: `relative flex flex-col bg-white shadow rounded-lg pointer-events-auto p-4`,
  header: `items-start justify-between p-4 border-b border-gray-300`,
  container: `fixed top-0 overflow-y-auto left-0 z-40 w-full h-full m-0`,
  overlay: `fixed top-0 left-0 z-30 w-screen h-screen bg-black opacity-50`,
  footer: `flex flex-wrap items-center justify-end p-3 border-t border-gray-300`,
  orientation: `mt-12 mx-8 pb-6 md:m-auto md:w-6/12 lg:w-4/12 md:pt-12 focus:outline-none`,
};

function Modal({ children, isOpen }) {
  const ref = React.useRef();
  // hide scrollbar and prevent body from moving when modal is open
  //put focus on modal dialogue
  React.useEffect(() => {
    if (!isOpen) return;
    ref.current?.focus();
    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      html.style.overflow = "";
      html.style.paddingRight = "";
    };
  }, [isOpen]);
  return (
    <Portal>
      {isOpen && (
        <>
          <div className={style.overlay} />
          <div className={style.container}>
            <div
              aria-modal={true}
              className={style.orientation}
              ref={ref}
              role="dialogue"
              tabIndex={-1}
            >
              <div className={style.content}>{children}</div>
            </div>
          </div>
        </>
      )}
    </Portal>
  );
}

function ModalHeader({ children }) {
  return (
    <div className={style.header}>
      <h4 className={style.headerTitle}>{children}</h4>
    </div>
  );
}
function ModalBody({ children }) {
  return <div className={style.body}>{children}</div>;
}
function ModalFooter({ children }) {
  return <div className={style.footer}>{children}</div>;
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
