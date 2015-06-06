using System;
using MCommerce.Infra.Data;
using MobileItFramework.Gateway.Payment.Domain;
using MobileItFramework.Gateway.Payment.Services;
using Ninject;
using System.Collections.Generic;

namespace MCommerce.Application.Services
{
    public class TransactionService : ITransactionService
    {
        [Inject]
        public IApplicationDbContext ApplicationDbContext { get; set; }

        public TransactionServiceResult Create(Transaction transaction)
        {
            ApplicationDbContext.Transactions.Add(transaction);
            ApplicationDbContext.TransactionHistories.Add(new TransactionHistory
            {
                Event = TransactionHistoryEvent.Create,
                TransactionId = transaction.Id,
                Date = DateTime.Now,
                Message = "Transaction Created",
                MessageSent = "No Message Required",
                MessageReceived = "No Message Required"
            });

            ApplicationDbContext.SaveChanges();

            return TransactionServiceResult.Success;
        }

        public TransactionServiceResult Update(Transaction transaction)
        {
            ApplicationDbContext.SaveChanges();

            return TransactionServiceResult.Success;
        }

        public TransactionServiceResult CreateHistory(TransactionHistory transactionHistory)
        {
            ApplicationDbContext.TransactionHistories.Add(transactionHistory);
            ApplicationDbContext.SaveChanges();

            return TransactionServiceResult.Success;
        }

        public TransactionServiceResult CreateHistory(IEnumerable<TransactionHistory> transactionHistories)
        {
            if (transactionHistories != null)
            {
                foreach (var transactionHistory in transactionHistories)
                {
                    ApplicationDbContext.TransactionHistories.Add(transactionHistory);
                }

                ApplicationDbContext.SaveChanges();
            }

            return TransactionServiceResult.Success;
        }
    }
}