// Copyright 2015-2019, University of Colorado Boulder

/**
 * The "nib" is the little piece attached to the right end of a spring that is grabbed
 * by the robotic arm's pincers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import hookesLaw from '../../hookesLaw.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function NibNode( options ) {

  options = merge( {
    fill: 'black',
    width: 10,
    height: 8
  }, options );

  Rectangle.call( this, 0, 0, options.width, options.height, 2, 2, options );
}

hookesLaw.register( 'NibNode', NibNode );

inherit( Rectangle, NibNode );
export default NibNode;