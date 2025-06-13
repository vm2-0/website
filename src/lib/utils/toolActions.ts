export const renderToolAction = (action: string, value?: string) => {
    switch (action) {
      case 'click':
        return `🖱️ Clicked at coordinates ${value}`;
      case 'type':
        return `⌨️ Typed "${value}"`;
      case 'scroll_down':
        return '⬇️ Scrolled down';
      case 'scroll_up':
        return '⬆️ Scrolled up';
      case 'mouse_move':
        return `🖱️ Moved cursor to coordinates ${value}`;
      case 'left_click':
        return '🖱️ Left clicked';
      case 'right_click':
        return '🖱️ Right clicked';
      case 'middle_click':
        return '🖱️ Middle clicked';
      case 'double_click':
        return '🖱️ Double clicked';
      case 'left_click_drag':
        return `🖱️ Dragged to coordinates ${value}`;
      case 'key':
        return `⌨️ Pressed ${value}`;
      case 'cursor_position':
        return `🖱️ Cursor at coordinates ${value}`;
      case 'screenshot':
        return `👀 Looking at screen`;
      default:
        return `${action}: ${value}`;
    }
  };