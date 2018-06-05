// Copyright 2015-2017, University of Colorado Boulder

/**
 * Model for the "Energy" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var hookesLaw = require( 'HOOKES_LAW/hookesLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SingleSpringSystem = require( 'HOOKES_LAW/common/model/SingleSpringSystem' );

  /**
   * @constructor
   */
  function EnergyModel() {
    this.system = new SingleSpringSystem( {
      springConstantRange: new RangeWithValue( 100, 400, 100 ), // units = N/m
      displacementRange: new RangeWithValue( -1, 1, 0 ) // units = m
    } );
  }

  hookesLaw.register( 'EnergyModel', EnergyModel );

  return inherit( Object, EnergyModel, {

    // @public
    reset: function() {
      this.system.reset();
    }
  } );
} );