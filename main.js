import React from 'react';
import ReactDOM from 'react-dom';
const manifest = require('json!./package.json');

const $ = require('jquery');

/**
 * OnionViewer is the container of the onion components. It reads data from blocks, and converts
 * it to onion format.
 */
class BlockMapContainer extends React.Component {
  static propTypes = {
    container: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    /**
     * showBlockRange
     * callback
     * when select some new blocks, use api to get what focused, then get all sub blocks
     * recursively.
     */


    //subscribe extension
    window.constructor.store.subscribe((state, lastAction) => {
      //console.log(lastAction.type);
      //FOCUS_BLOCKS: click on some block, need to refresh
      //BLOCK_SET_COLOR: change a block color, need to refresh
      //BLOCK_RENAME: rename, refresh
      //FOCUS_BLOCK_OPTION: click on a template item, refresh
      //FOCUS_FORCE_BLOCKS: click on an inventory block.
      //BLOCK_SET_SEQUENCE: new sequence set to a block, remove cached sequence, then refresh.
      if (lastAction.type === 'FOCUS_BLOCKS'
        || lastAction.type === 'BLOCK_SET_COLOR'
        || lastAction.type === 'BLOCK_RENAME'
        || lastAction.type === 'FOCUS_BLOCK_OPTION'
      ) {
      } else if (lastAction.type === 'FOCUS_FORCE_BLOCKS') {
        const blocks = window.constructor.api.focus.focusGetBlocks();
        this.showBlocks(blocks);
      } else if (lastAction.type === 'BLOCK_SET_SEQUENCE') {
        const block = lastAction.block;


      }
    });

    this.setCallBack();

  }

  componentWillMount() {

  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.allowToRefresh = true;
    this.showBlockRange();
  }

  componentDidUpdate() {
    const _this = this;
    setTimeout(() => {_this.allowToRefresh = true;}, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  setCallBack() {
    //read dimensions of onion container
    this.updateDimensions = () => {
      const _width = $('.ExtensionView-content').width();
      const _height = $('.ExtensionView-content').height();
      const width = Math.max(300, _width);
      const height = Math.max(100, _height);
      this.setState({ width, height });
    };
  }

  showBlockRange() {
    const leafBlocks = [];
    const project = window.constructor.api.focus.focusGetProject();
    let projectName = project.getName();

    const topSelectedBlocks = window.constructor.api.focus.focusGetBlockRange();
    const focusedBlocks = window.constructor.api.focus.focusGetBlocks();

    // set blocks
    if (topSelectedBlocks && topSelectedBlocks[0]) {
      let constructBlock =
        window.constructor.api.blocks.blockGetParentRoot(topSelectedBlocks[0].id);

      if (!constructBlock) {
        constructBlock = topSelectedBlocks[0];
      }

      return this.showBlockMap(constructBlock, focusedBlocks);

    }

    return <div>...</div>;
  }

  showBlockMap(constructBlock, focusedBlocks) {
    const { width, height } = this.state;
    return (
      <svg
      width={width}
      height={height}
      >
        <rect
          x="5"
          y="5"
          width={width-10}
          height={height-10}
          fill={red}
        />
      </svg>
    )
  }

  render() {

    let obj = this.showBlockRange();

    return
    <div>
      {obj}
    </div>
  }
} // end of OnionViewer

/**
 * the function framework calls, it's a main()
 * @param container
 * @param options
 */
function render(container, options) {
  const { left, top, width, height } = options.boundingBox;
  ReactDOM.render(<BlockMapContainer
    container={container}
    left={left}
    top={top}
    width={width}
    height={height}
  />, container);
}

window.constructor.extensions.register('BlockMap', render);
