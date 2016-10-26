// Copyright 2015-2016, University of Colorado Boulder

/**
 * Properties that are specific to visibility of things in the "Intro" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var hookesLaw = require( 'HOOKES_LAW/hookesLaw' );
  var HookesLawQueryParameters = require( 'HOOKES_LAW/common/HookesLawQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function IntroViewProperties() {

    // to make development easier
    var checked = HookesLawQueryParameters.dev;

    // @public {number} number of systems visible, 1 or 2
    this.numberOfSystemsProperty = new Property( 1 );

    // @public {boolean} is the applied force vector visible?
    this.appliedForceVectorVisibleProperty = new Property( checked );

    // @public {boolean} is the spring force vector visible?
    this.springForceVectorVisibleProperty = new Property( checked );

    // @public {boolean} is the displacement vector visible?
    this.displacementVectorVisibleProperty = new Property( checked );

    // @public {boolean} is the equilibrium position visible?
    this.equilibriumPositionVisibleProperty = new Property( checked );

    // @public {boolean} are numeric values visible?
    this.valuesVisibleProperty = new Property( checked );
  }

  hookesLaw.register( 'IntroViewProperties', IntroViewProperties );

  return inherit( Object, IntroViewProperties, {

    // @public
    reset: function() {
      this.numberOfSystemsProperty.reset();
      this.appliedForceVectorVisibleProperty.reset();
      this.springForceVectorVisibleProperty.reset();
      this.displacementVectorVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
    }
  } );
} );
