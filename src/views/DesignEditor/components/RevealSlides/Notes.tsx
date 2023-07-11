import Reveal from "reveal.js";
import { useEffect } from "react";

interface MessageData {
  namespace: string;
  type: string;
  url?: string;
  state?: any;
  methodName?: string;
  arguments?: any[];
  callId?: string;
  result?: any;
}

const RevealNotes = (): void => {
  let notesPopup: Window | null = null;

  function openNotes(notesFilePath?: string): void {
    if (notesPopup && !notesPopup.closed) {
      notesPopup.focus();
      return;
    }

    if (!notesFilePath) {
      const jsFileLocation = document.querySelector('script[src$="notes.js"]')
        ?.src; // this js file path
      if (jsFileLocation) {
        const jsFolderPath = jsFileLocation.replace(/notes\.js(\?.*)?$/, ""); // the js folder path
        notesFilePath = jsFolderPath + "notes.html";
      }
    }

    notesPopup = window.open(
      notesFilePath,
      "reveal.js - Notes",
      "width=1100,height=700"
    );

    if (!notesPopup) {
      alert(
        "Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view."
      );
      return;
    }

    function connect(): void {
      const connectInterval = setInterval(() => {
        notesPopup?.postMessage(
          JSON.stringify({
            namespace: "reveal-notes",
            type: "connect",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              window.location.search,
            state: Reveal.getState(),
          }),
          "*"
        );
      }, 500);

      window.addEventListener("message", (event) => {
        const data: MessageData = JSON.parse(event.data);
        if (
          data &&
          data.namespace === "reveal-notes" &&
          data.type === "connected"
        ) {
          clearInterval(connectInterval);
          onConnected();
        }
        if (
          data &&
          data.namespace === "reveal-notes" &&
          data.type === "call"
        ) {
          callRevealApi(data.methodName, data.arguments, data.callId);
        }
      });
    }

    function callRevealApi(
      methodName: string,
      methodArguments: any[],
      callId?: string
    ): void {
      const result = Reveal[methodName]?.apply(Reveal, methodArguments);
      notesPopup?.postMessage(
        JSON.stringify({
          namespace: "reveal-notes",
          type: "return",
          result,
          callId,
        }),
        "*"
      );
    }

    function post(event?: Event): void {
      const slideElement = Reveal.getCurrentSlide();
      const notesElement = slideElement?.querySelector("aside.notes");
      const fragmentElement = slideElement?.querySelector(".current-fragment");

      const messageData: MessageData = {
        namespace: "reveal-notes",
        type: "state",
        notes: "",
        markdown: false,
        whitespace: "normal",
        state: Reveal.getState(),
      };

      if (slideElement?.hasAttribute("data-notes")) {
        messageData.notes = slideElement.getAttribute("data-notes") || "";
        messageData.whitespace = "pre-wrap";
      }

      if (fragmentElement) {
        const fragmentNotes = fragmentElement.querySelector("aside.notes");
        if (fragmentNotes) {
          notesElement = fragmentNotes;
        } else if (fragmentElement.hasAttribute("data-notes")) {
          messageData.notes = fragmentElement.getAttribute("data-notes") || "";
          messageData.whitespace = "pre-wrap";
          notesElement = null;
        }
      }

      if (notesElement) {
        messageData.notes = notesElement.innerHTML;
        messageData.markdown =
          typeof notesElement.getAttribute("data-markdown") === "string";
      }

      notesPopup?.postMessage(JSON.stringify(messageData), "*");
    }

    function onConnected(): void {
      Reveal.addEventListener("slidechanged", post);
      Reveal.addEventListener("fragmentshown", post);
      Reveal.addEventListener("fragmenthidden", post);
      Reveal.addEventListener("overviewhidden", post);
      Reveal.addEventListener("overviewshown", post);
      Reveal.addEventListener("paused", post);
      Reveal.addEventListener("resumed", post);

      post();
    }

    connect();
  }

  useEffect(() => {
    if (!/receiver/i.test(window.location.search)) {
      if (window.location.search.match(/(\?|\&)notes/gi) !== null) {
        openNotes();
      }

      Reveal.addKeyBinding(
        {
          keyCode: 83,
          key: "S",
          description: "Speaker notes view",
        },
        openNotes
      );
    }
  }, []);

  return;
};

Reveal.registerPlugin("notes", RevealNotes);

export default RevealNotes;
