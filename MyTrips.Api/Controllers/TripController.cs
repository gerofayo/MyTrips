using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Mappers;
using MyTrips.Api.Models;

namespace MyTrips.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {

        //TODO: Implement persistence with a database (e.g., Entity Framework Core)
        private static readonly Trip trip1 = new Trip(
            name: "Vacation in Hawaii",
            destination: "Hawaii",
            startDate: new DateOnly(2024, 12, 20),
            endDate: new DateOnly(2024, 12, 30),
            budget: 3000m,
            currency: "USD"
        );
        private static readonly List<Trip> _trips = [
            trip1
        ];

        [HttpPost]
        public ActionResult<TripResponse> CreateTrip(CreateTripRequest request)
        {
            var trip = TripMapper.ToModel(request);
            _trips.Add(trip);
            var response = TripMapper.ToResponse(trip);
            return CreatedAtAction(nameof(GetTripById), new { id = trip.Id }, response);
        }
        [HttpGet]
        public ActionResult<IEnumerable<TripResponse>> GetAllTrips()
        {
            var response = _trips.Select(TripMapper.ToResponse).ToList();

            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<TripResponse> GetTripById(Guid id)
        {
            var trip = _trips.FirstOrDefault(t => t.Id == id);

            if (trip is null)
                return NotFound();

            return TripMapper.ToResponse(trip);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<TripResponse> UpdateTrip(Guid id, UpdateTripRequest request)
        {
            var trip = _trips.FirstOrDefault(t => t.Id == id);

            if (trip is null)
                return NotFound();

            trip.Update(request);

            var response = TripMapper.ToResponse(trip);

            return Ok(response);
        }


        [HttpDelete("{id:guid}")]
        public ActionResult DeleteTrip(Guid id)
        {
            var trip = _trips.FirstOrDefault(t => t.Id == id);

            if (trip is null)
                return NotFound();

            _trips.Remove(trip);
            return NoContent();

        }
    }
}
