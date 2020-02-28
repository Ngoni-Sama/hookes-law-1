// Copyright 2015-2020, University of Colorado Boulder

/**
 * View-specific properties for the "Systems" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import HookesLawQueryParameters from '../../common/HookesLawQueryParameters.js';
import ViewProperties from '../../common/view/ViewProperties.js';
import hookesLaw from '../../hookesLaw.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function SystemsViewProperties( tandem ) {

  ViewProperties.call( this, tandem );

  // @public which system is visible
  this.seriesParallelProperty = new StringProperty( 'parallel', {
    validValues: [ 'series', 'parallel' ],
    tandem: tandem.createTandem( 'seriesParallelProperty' )
  } );

  // @public is the spring force vector visible?
  this.springForceVectorVisibleProperty = new BooleanProperty( HookesLawQueryParameters.checkAll, {
    tandem: tandem.createTandem( 'springForceVectorVisibleProperty' )
  } );

  // @public how spring force is represented
  this.springForceRepresentationProperty = new StringProperty( 'total', {
    validValues: [ 'total', 'components' ],
    tandem: tandem.createTandem( 'springForceRepresentationProperty' )
  } );
}

hookesLaw.register( 'SystemsViewProperties', SystemsViewProperties );

export default inherit( ViewProperties, SystemsViewProperties, {

  /**
   * @public
   * @override
   */
  reset: function() {
    this.seriesParallelProperty.reset();
    this.springForceVectorVisibleProperty.reset();
    this.springForceRepresentationProperty.reset();
    ViewProperties.prototype.reset.call( this );
  }
} );