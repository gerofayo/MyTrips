using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Services;

namespace MyTrips.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController(TripService tripService) : ControllerBase
    {

        private readonly TripService _tripService = tripService;

        [HttpPost]
        public ActionResult<TripResponse> CreateTrip(CreateTripRequest request)
        {
            var createdTrip = _tripService.CreateTrip(request);
            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip.Id }, createdTrip);
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<TripResponse>> GetAllTrips()
        {
            var response = _tripService.GetAllTrips();
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<TripResponse> GetTripById(Guid id)
        {
            var trip = _tripService.GetTripById(id);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<TripResponse> UpdateTrip(Guid id, UpdateTripRequest request)
        {
            var trip = _tripService.UpdateTrip(id, request);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }


        [HttpDelete("{id:guid}")]
        public ActionResult DeleteTrip(Guid id)
        {
            var isDeleted = _tripService.DeleteTrip(id);

            if (!isDeleted)
                return NotFound();
            else
                return NoContent();

        }
    }
}
