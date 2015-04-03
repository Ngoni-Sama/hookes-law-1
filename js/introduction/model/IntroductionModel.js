//  Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for the "Introduction" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Spring = require( 'HOOKES_LAW/common/model/Spring' );

  /**
   * @constructor
   */
  function IntroductionModel() {

    PropertySet.call( this, {
      numberOfSystems: 1  // {number} 1 or 2
    } );

    this.spring1 = new Spring();
    this.spring2 = new Spring();
  }

  return inherit( PropertySet, IntroductionModel );
} );