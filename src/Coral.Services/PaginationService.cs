﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Coral.Database;
using Coral.Database.Models;
using Coral.Dto.Models;
using Coral.Services.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coral.Services
{
    public interface IPaginationService
    {
        public Task<PaginatedQuery<TDtoType>> PaginateQuery<TSourceType, TDtoType>(int offset = 0, int limit = 10)
            where TSourceType : BaseTable
            where TDtoType : class;

        public Task<PaginatedQuery<TDtoType>> PaginateQuery<TSourceType, TDtoType>(Func<DbSet<TSourceType>, IQueryable<TSourceType>> sourceQuery, int offset = 0, int limit = 10)
            where TSourceType : BaseTable
            where TDtoType : class;
    }

    public class PaginationService : IPaginationService
    {
        private readonly IMapper _mapper;
        private readonly CoralDbContext _context;

        public PaginationService(IMapper mapper, CoralDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<PaginatedQuery<TDtoType>> PaginateQuery<TSourceType, TDtoType>(Func<DbSet<TSourceType>, IQueryable<TSourceType>> sourceQuery, int offset = 0, int limit = 10)
            where TSourceType : BaseTable
            where TDtoType : class
        {
            var dbSet = _context.Set<TSourceType>();
            var queryable = sourceQuery(dbSet);
            return await PaginateQueryable<TSourceType, TDtoType>(queryable, offset, limit);
        }

        public async Task<PaginatedQuery<TDtoType>> PaginateQuery<TSourceType, TDtoType>(int offset = 0, int limit = 10)
            where TSourceType : BaseTable
            where TDtoType : class
        {
            var contextSet = _context.Set<TSourceType>();
            return await PaginateQueryable<TSourceType, TDtoType>(contextSet, offset, limit);
        }

        private async Task<PaginatedQuery<TDtoType>> PaginateQueryable<TSourceType, TDtoType>(IQueryable<TSourceType> queryable, int offset = 0, int limit = 10)
            where TSourceType : BaseTable
            where TDtoType : class
        {
            var totalItemCount = await queryable.CountAsync();
            var query = queryable
                .OrderBy(i => i.Id)
                .Skip(offset)
                .Take(limit);
            var availableRecords = Math.Max(0, totalItemCount - (offset + limit));
            var querySize = await query.CountAsync();
            var data = await query
                .ProjectTo<TDtoType>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PaginatedQuery<TDtoType>()
            {
                AvailableRecords = availableRecords,
                ResultCount = querySize,
                TotalRecords = totalItemCount,
                Data = data
            };
        } 
    }
}
