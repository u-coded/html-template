import scrollLock from './utils/scrollLock';

export default () => {
  const MODAL_SEL = '[data-modal]';
  const OPEN_SEL = '[data-modal-open]';
  const CONTAINER_SEL = '[data-modal-container]';
  const CLOSE_SEL = '[data-modal-close]';
  const PREV_SEL = '[data-modal-prev]';
  const NEXT_SEL = '[data-modal-next]';
  const OPEN_CLASS = 'is-open';
  const CLOSE_CLASS = 'is-close';

  const body = document.body;
  const locker = scrollLock();
  const modals = document.querySelectorAll<HTMLDialogElement>(MODAL_SEL);
  const openTriggers = document.querySelectorAll<HTMLElement>(OPEN_SEL);
  const closeTriggers = document.querySelectorAll<HTMLElement>(CLOSE_SEL);
  const prevTriggers = document.querySelectorAll<HTMLElement>(PREV_SEL);
  const nextTriggers = document.querySelectorAll<HTMLElement>(NEXT_SEL);

  // モーダルを開く関数
  function openModal(modalId: string, preserveScrollPosition = false) {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (!modal) return;

    if (!preserveScrollPosition) {
      locker.lock();
    }

    body.setAttribute('inert', '');

    modal.classList.add(OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    modal.showModal();

    modal.removeAttribute('inert');

    requestAnimationFrame(() => {
      modal.classList.remove(OPEN_CLASS);
    });
  }

  // モーダルを閉じる関数
  function closeModal(modalId: string, keepScrollPosition = false) {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (!modal) return;

    if (
      document.activeElement instanceof HTMLElement &&
      modal.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }

    modal.classList.add(CLOSE_CLASS);
    modal.setAttribute('aria-hidden', 'true');

    modal.addEventListener(
      'transitionend',
      () => {
        modal.classList.remove(CLOSE_CLASS);
        modal.close();

        if (!keepScrollPosition) {
          body.removeAttribute('inert');
          locker.unlock();

          const openTrigger = document.querySelector<HTMLElement>(
            `[data-modal-open="${modalId}"]`,
          );
          openTrigger?.focus();
        }
      },
      { once: true },
    );
  }

  // モーダルを切り替える関数
  function switchModal(currentModalId: string, nextModalId: string) {
    const currentModal = document.getElementById(
      currentModalId,
    ) as HTMLDialogElement | null;
    if (!currentModal) return;

    if (
      document.activeElement instanceof HTMLElement &&
      currentModal.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }

    currentModal.classList.add(CLOSE_CLASS);
    currentModal.setAttribute('aria-hidden', 'true');

    currentModal.addEventListener(
      'transitionend',
      () => {
        currentModal.classList.remove(CLOSE_CLASS);
        currentModal.close();

        openModal(nextModalId, true);
      },
      { once: true },
    );
  }

  // 各モーダルを開くボタン
  openTriggers.forEach((openTrigger) => {
    openTrigger.addEventListener('click', () => {
      const modalId = openTrigger.dataset.modalOpen;
      if (modalId) openModal(modalId);
    });
  });

  // 各モーダルを閉じるボタン
  closeTriggers.forEach((closeTrigger) => {
    closeTrigger.addEventListener('click', () => {
      const modal = closeTrigger.closest<HTMLElement>(MODAL_SEL);
      if (modal) closeModal(modal.id);
    });
  });

  // 前のモーダルを開くボタン
  prevTriggers.forEach((prevTrigger) => {
    prevTrigger.addEventListener('click', () => {
      const currentModal = prevTrigger.closest<HTMLElement>(MODAL_SEL);
      const prevModalId = prevTrigger.dataset.modalPrev;
      if (currentModal && prevModalId)
        switchModal(currentModal.id, prevModalId);
    });
  });

  // 次のモーダルを開くボタン
  nextTriggers.forEach((nextTrigger) => {
    nextTrigger.addEventListener('click', () => {
      const currentModal = nextTrigger.closest<HTMLElement>(MODAL_SEL);
      const nextModalId = nextTrigger.dataset.modalNext;
      if (currentModal && nextModalId)
        switchModal(currentModal.id, nextModalId);
    });
  });

  // 各モーダルに対して外部クリックやキーボードイベントを設定
  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest(CONTAINER_SEL)) {
        closeModal(modal.id);
      }
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(modal.id);
      }
    });
  });
};
