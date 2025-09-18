const fs = require('fs');
const path = require('path');

// Legal Knowledge Base Builder - No Scraping Required
// Uses publicly available structured data and government APIs

class LegalKnowledgeBuilder {
    constructor() {
        this.knowledgeDir = path.join(__dirname, 'legal_knowledge');
        this.trainingDir = path.join(__dirname, 'training_data');
        this.ensureDirectories();
        
        // Free public legal data sources
        this.sources = {
            federal: {
                capta: 'https://www.acf.hhs.gov/sites/default/files/documents/cb/capta-fact-sheet.pdf',
                asfa: 'https://www.acf.hhs.gov/sites/default/files/documents/cb/asfa-summary.pdf',
                icwa: 'https://www.bia.gov/sites/bia.gov/files/assets/public/pdf/idc1-028783.pdf',
                titleIV: 'https://www.acf.hhs.gov/sites/default/files/documents/cb/title-iv-e-overview.pdf'
            },
            florida: {
                chapter39: 'http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/0039.htm',
                procedures: 'https://www.flrules.org/gateway/ChapterHome.asp?Chapter=8'
            },
            training: {
                wacita: 'https://wacita.org/federal-law',
                childWelfare: 'https://www.childwelfare.gov/topics/systemwide/laws-policies/',
                floridaCourts: 'https://www.flcourts.org/Resources-Services/Court-Improvement/Family-Courts/Dependency'
            }
        };
        
        // Pre-built legal knowledge templates
        this.legalTemplates = this.initializeLegalTemplates();
    }

    ensureDirectories() {
        [this.knowledgeDir, this.trainingDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    initializeLegalTemplates() {
        return {
            federal: {
                capta: {
                    title: "Child Abuse Prevention and Treatment Act (CAPTA)",
                    summary: "Establishes minimum standards for child protection systems and provides federal funding for child abuse prevention programs.",
                    keyPoints: [
                        "Requires mandatory reporting systems",
                        "Sets standards for child protective investigations",
                        "Provides funding for prevention and treatment programs",
                        "Establishes state eligibility requirements"
                    ],
                    trainingPrompts: [
                        {
                            input: "What is CAPTA and what does it require?",
                            output: "CAPTA (Child Abuse Prevention and Treatment Act) is federal legislation that establishes minimum standards for child protection systems. It requires states to have mandatory reporting laws, investigation procedures, and treatment programs to receive federal funding."
                        },
                        {
                            input: "How does CAPTA affect state child welfare systems?",
                            output: "CAPTA sets minimum standards that states must meet to receive federal child welfare funding, including requirements for mandatory reporting, investigation procedures, and prevention programs."
                        }
                    ]
                },
                asfa: {
                    title: "Adoption and Safe Families Act (ASFA)",
                    summary: "Prioritizes child safety and permanency, establishes timelines for permanency decisions, and clarifies when reasonable efforts are not required.",
                    keyPoints: [
                        "Child safety is paramount concern",
                        "15 out of 22 months timeline for permanency",
                        "Reasonable efforts exceptions for severe cases",
                        "Concurrent planning requirements"
                    ],
                    trainingPrompts: [
                        {
                            input: "What are the ASFA timelines for permanency?",
                            output: "ASFA requires permanency hearings within 12 months and filing for termination of parental rights if a child has been in care for 15 of the most recent 22 months, unless specific exceptions apply."
                        },
                        {
                            input: "When are reasonable efforts not required under ASFA?",
                            output: "Reasonable efforts to reunify are not required when a parent has committed murder or voluntary manslaughter of another child, committed felony assault resulting in serious injury to the child or another child, or had parental rights to a sibling terminated involuntarily."
                        }
                    ]
                },
                icwa: {
                    title: "Indian Child Welfare Act (ICWA)",
                    summary: "Protects the best interests of Indian children and promotes stability of Indian tribes and families.",
                    keyPoints: [
                        "Applies to Native American children",
                        "Requires higher burden of proof",
                        "Mandates placement preferences",
                        "Gives tribal courts jurisdiction"
                    ],
                    trainingPrompts: [
                        {
                            input: "What is the placement preference under ICWA?",
                            output: "ICWA requires placement preferences in this order: (1) member of child's extended family, (2) foster home licensed by tribe, (3) Indian foster home, (4) institution operated by Indians or approved by tribe."
                        }
                    ]
                }
            },
            florida: {
                chapter39: {
                    title: "Florida Statutes Chapter 39 - Proceedings Related to Children",
                    summary: "Governs dependency proceedings in Florida, establishing procedures for child protection cases.",
                    sections: {
                        "39.001": "Purposes and intent",
                        "39.01": "Definitions",
                        "39.401": "Taking a child into custody",
                        "39.402": "Placement in shelter",
                        "39.501": "Petition for dependency"
                    },
                    procedures: {
                        shelterHearing: {
                            timeline: "Within 24 hours of removal",
                            purpose: "Determine probable cause for continued custody",
                            rights: "Parent has right to counsel and to contest removal"
                        },
                        arraignment: {
                            timeline: "Within 28 days of petition filing",
                            purpose: "Parent enters plea to dependency allegations",
                            outcome: "Admit, deny, or consent to finding of dependency"
                        }
                    },
                    trainingPrompts: [
                        {
                            input: "What happens at a Florida shelter hearing?",
                            output: "A shelter hearing must be held within 24 hours of a child's removal. The court determines whether there's probable cause to believe the child should remain in out-of-home care. Parents have the right to legal counsel and can contest the removal."
                        },
                        {
                            input: "How long does a parent have to respond to a dependency petition in Florida?",
                            output: "Under Florida Statute 39.506, arraignment on a dependency petition must occur within 28 days of filing. Parents can admit to, deny, or consent to a finding of dependency at this hearing."
                        }
                    ]
                }
            }
        };
    }

    async buildKnowledgeBase() {
        console.log('🏗️ Building Legal Knowledge Base...\n');

        // Step 1: Generate structured knowledge files
        console.log('📚 Creating structured legal knowledge...');
        this.createStructuredKnowledge();

        // Step 2: Generate training data
        console.log('🧠 Generating AI training data...');
        this.generateTrainingData();

        // Step 3: Create legal procedure flowcharts
        console.log('📋 Creating procedure guides...');
        this.createProcedureGuides();

        // Step 4: Generate comprehensive training dataset
        console.log('🎯 Compiling final training dataset...');
        this.compileFinalDataset();

        console.log('\n✅ Legal Knowledge Base Complete!');
        this.printSummary();
    }

    createStructuredKnowledge() {
        // Save federal laws
        fs.writeFileSync(
            path.join(this.knowledgeDir, 'federal_laws.json'),
            JSON.stringify(this.legalTemplates.federal, null, 2)
        );

        // Save Florida laws  
        fs.writeFileSync(
            path.join(this.knowledgeDir, 'florida_laws.json'),
            JSON.stringify(this.legalTemplates.florida, null, 2)
        );

        // Create rights and procedures reference
        const rightsAndProcedures = {
            parentRights: [
                "Right to notice of all hearings",
                "Right to legal counsel",
                "Right to participate in case planning", 
                "Right to visitation with child",
                "Right to appeal court decisions",
                "Right to request judicial review"
            ],
            childRights: [
                "Right to safety and protection",
                "Right to legal representation or GAL",
                "Right to placement with relatives when possible",
                "Right to maintain sibling relationships",
                "Right to education and medical care"
            ],
            courtProcedures: {
                dependency: [
                    "Intake and investigation",
                    "Emergency removal (if necessary)", 
                    "Shelter hearing (within 24 hours)",
                    "Petition filing (within 21 days)",
                    "Arraignment (within 28 days)",
                    "Adjudicatory hearing",
                    "Disposition hearing",
                    "Judicial reviews (every 6 months)",
                    "Permanency hearing (within 12 months)"
                ]
            }
        };

        fs.writeFileSync(
            path.join(this.knowledgeDir, 'rights_and_procedures.json'),
            JSON.stringify(rightsAndProcedures, null, 2)
        );
    }

    generateTrainingData() {
        const trainingData = [];

        // Collect all training prompts from templates
        Object.values(this.legalTemplates.federal).forEach(law => {
            if (law.trainingPrompts) {
                trainingData.push(...law.trainingPrompts);
            }
        });

        Object.values(this.legalTemplates.florida).forEach(law => {
            if (law.trainingPrompts) {
                trainingData.push(...law.trainingPrompts);
            }
        });

        // Add procedural training examples
        const proceduralTraining = [
            {
                input: "What is the timeline for a permanency hearing?",
                output: "Under ASFA, a permanency hearing must be held within 12 months of the child entering foster care, and every 12 months thereafter until permanency is achieved."
            },
            {
                input: "What are the placement options in dependency cases?",
                output: "Placement options include: return home with services, relative placement, non-relative foster care, group home, residential treatment, or independent living (for older youth)."
            },
            {
                input: "What services might be ordered in a dependency case?",
                output: "Services may include parenting classes, substance abuse treatment, mental health counseling, domestic violence counseling, housing assistance, and supervised visitation."
            }
        ];

        trainingData.push(...proceduralTraining);

        // Save training data
        fs.writeFileSync(
            path.join(this.trainingDir, 'legal_qa_training.json'),
            JSON.stringify(trainingData, null, 2)
        );

        console.log(`  Generated ${trainingData.length} training examples`);
    }

    createProcedureGuides() {
        const procedures = {
            dependencyProcess: {
                title: "Florida Dependency Process Guide",
                steps: [
                    {
                        step: 1,
                        name: "Report and Investigation",
                        description: "DCF receives report of abuse/neglect and conducts safety assessment",
                        timeline: "60 days for investigation"
                    },
                    {
                        step: 2, 
                        name: "Emergency Removal (if needed)",
                        description: "Child removed if in immediate danger",
                        timeline: "Must be based on immediate danger"
                    },
                    {
                        step: 3,
                        name: "Shelter Hearing",
                        description: "Court determines if removal was necessary",
                        timeline: "Within 24 hours of removal"
                    },
                    {
                        step: 4,
                        name: "Petition Filed",
                        description: "Formal allegations of dependency filed with court",
                        timeline: "Within 21 days of shelter hearing"
                    },
                    {
                        step: 5,
                        name: "Arraignment",
                        description: "Parents respond to allegations",
                        timeline: "Within 28 days of petition"
                    },
                    {
                        step: 6,
                        name: "Adjudicatory Hearing", 
                        description: "Court determines if child is dependent",
                        timeline: "Within 30 days if parent denies"
                    },
                    {
                        step: 7,
                        name: "Disposition",
                        description: "Court sets case plan and services",
                        timeline: "Within 30 days of adjudication"
                    },
                    {
                        step: 8,
                        name: "Judicial Reviews",
                        description: "Regular review of progress on case plan",
                        timeline: "Every 6 months"
                    },
                    {
                        step: 9,
                        name: "Permanency Hearing",
                        description: "Court determines permanent plan for child",
                        timeline: "Within 12 months of removal"
                    }
                ]
            }
        };

        fs.writeFileSync(
            path.join(this.knowledgeDir, 'procedure_guides.json'),
            JSON.stringify(procedures, null, 2)
        );
    }

    compileFinalDataset() {
        // Combine all training data into final dataset
        const legalQA = JSON.parse(fs.readFileSync(path.join(this.trainingDir, 'legal_qa_training.json')));
        
        // Add scenario-based training
        const scenarios = [
            {
                input: "A parent missed 3 scheduled visits. What might happen at the next judicial review?",
                output: "The court will review the parent's compliance with the case plan. Missed visits could result in modified visitation, additional services, or potentially moving toward termination of parental rights if this is part of a pattern of non-compliance."
            },
            {
                input: "What's the difference between adjudication and disposition in dependency court?",
                output: "Adjudication determines whether the child is dependent (whether abuse/neglect occurred). Disposition occurs after adjudication and determines what services and placement are needed to address the safety issues."
            },
            {
                input: "Can a parent appeal a dependency finding?",
                output: "Yes, parents have the right to appeal any court order, including dependency findings, placement decisions, and case plan requirements. Appeals must typically be filed within 30 days."
            }
        ];

        const finalDataset = {
            metadata: {
                created: new Date().toISOString(),
                totalExamples: legalQA.length + scenarios.length,
                sources: ["Federal Law", "Florida Statutes", "Court Procedures", "Rights & Responsibilities"],
                purpose: "Training legal AI assistant for juvenile dependency law"
            },
            trainingData: [...legalQA, ...scenarios]
        };

        fs.writeFileSync(
            path.join(this.trainingDir, 'final_training_dataset.json'),
            JSON.stringify(finalDataset, null, 2)
        );

        // Create a simple CSV version for easy review
        const csvData = finalDataset.trainingData.map(item => ({
            input: item.input.replace(/"/g, '""'),
            output: item.output.replace(/"/g, '""')
        }));

        const csvContent = 'input,output\n' + 
            csvData.map(row => `"${row.input}","${row.output}"`).join('\n');

        fs.writeFileSync(path.join(this.trainingDir, 'training_data.csv'), csvContent);
    }

    printSummary() {
        console.log('\n📁 Files Created:');
        console.log('  📚 Knowledge Base:');
        console.log('    - federal_laws.json (CAPTA, ASFA, ICWA)');
        console.log('    - florida_laws.json (Chapter 39)');
        console.log('    - rights_and_procedures.json');
        console.log('    - procedure_guides.json');
        console.log('\n  🧠 Training Data:');
        console.log('    - final_training_dataset.json (complete)');
        console.log('    - training_data.csv (simplified)');
        console.log('    - legal_qa_training.json (Q&A pairs)');

        // Count total training examples
        const finalDataset = JSON.parse(fs.readFileSync(path.join(this.trainingDir, 'final_training_dataset.json')));
        console.log(`\n📊 Training Examples: ${finalDataset.totalExamples}`);
        console.log('📖 Ready for AI model training!');
    }

    // Utility method to add custom knowledge
    addCustomKnowledge(category, subcategory, data) {
        const filePath = path.join(this.knowledgeDir, `${category}_laws.json`);
        let existingData = {};
        
        if (fs.existsSync(filePath)) {
            existingData = JSON.parse(fs.readFileSync(filePath));
        }
        
        existingData[subcategory] = data;
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        
        console.log(`✅ Added ${subcategory} to ${category} knowledge base`);
    }

    // Method to generate additional training examples
    generateAdditionalExamples(topic, examples) {
        const trainingFile = path.join(this.trainingDir, 'legal_qa_training.json');
        const existing = JSON.parse(fs.readFileSync(trainingFile));
        
        existing.push(...examples);
        
        fs.writeFileSync(trainingFile, JSON.stringify(existing, null, 2));
        console.log(`✅ Added ${examples.length} training examples for ${topic}`);
    }
}

// Run the knowledge base builder
async function main() {
    console.log('🚀 Starting Legal Knowledge Base Builder...\n');
    
    const builder = new LegalKnowledgeBuilder();
    await builder.buildKnowledgeBase();
    
    console.log('\n🎉 Knowledge base ready for AI training!');
    console.log('\nNext steps:');
    console.log('1. Review generated training data');
    console.log('2. Add any custom knowledge using builder.addCustomKnowledge()');
    console.log('3. Use final_training_dataset.json to train your model');
}

// Export for use as module
module.exports = LegalKnowledgeBuilder;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
