// Copyright 2015, University of Colorado Boulder

/**
 * Model for the "Systems" screen, unrelated series and parallel systems.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParallelSystem = require( 'HOOKES_LAW/systems/model/ParallelSystem' );
  var SeriesSystem = require( 'HOOKES_LAW/systems/model/SeriesSystem' );

  /**
   * @constructor
   */
  function SystemsModel() {
    this.seriesSystem = new SeriesSystem();
    this.parallelSystem = new ParallelSystem();
  }

  return inherit( Object, SystemsModel, {

    // @public
    reset: function() {
      this.seriesSystem.reset();
      this.parallelSystem.reset();
    }
  } );
} );