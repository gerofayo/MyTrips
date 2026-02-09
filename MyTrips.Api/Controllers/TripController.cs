using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Models;

namespace MyTrips.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {

        //TODO: Implement persistence with a database (e.g., Entity Framework Core)
        private static readonly List<Trip> _trips = new(); // TEMPORAL IN-MEMORY STORAGE

        [HttpPost]
        public ActionResult<TripResponse> CreateTrip(CreateTripRequest request)
        {
            var trip = new Trip(
                request.Name,
                request.StartDate,
                request.EndDate,
                request.Budget
            );

            _trips.Add(trip);

            var response = new TripResponse
            {
                Id = trip.Id,
                Name = trip.Name,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget
            };

            return CreatedAtAction(nameof(GetTripById), new { id = trip.Id }, response);
        }
        [HttpGet]
        public ActionResult<IEnumerable<TripResponse>> GetAllTrips()
        {
            var response = _trips.Select(trip => new TripResponse
            {
                Id = trip.Id,
                Name = trip.Name,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<TripResponse> GetTripById(Guid id)
        {
            var trip = _trips.FirstOrDefault(t => t.Id == id);

            if (trip is null)
                return NotFound();

            return new TripResponse
            {
                Id = trip.Id,
                Name = trip.Name,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget
            };
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
