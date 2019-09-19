// Copyright 2015, University of Colorado Boulder

/**
 * The "nib" is the little piece attached to the right end of a spring that is grabbed
 * by the robotic arm's pincers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const hookesLaw = require( 'HOOKES_LAW/hookesLaw' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NibNode( options ) {

    options = _.extend( {
      fill: 'black',
      width: 10,
      height: 8
    }, options );

    Rectangle.call( this, 0, 0, options.width, options.height, 2, 2, options );
  }

  hookesLaw.register( 'NibNode', NibNode );

  return inherit( Rectangle, NibNode );
} );
